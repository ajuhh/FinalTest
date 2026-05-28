from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, response, status
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from .models import Paragraph
from .serializers import (
    LoginSerializer,
    ParagraphSearchSerializer,
    ParagraphSerializer,
    RegisterSerializer,
    UserSerializer,
)
from .tasks import analyze_paragraph_text

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return response.Response({'token': token.key, 'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = User.objects.filter(email__iexact=email).first()
        if not user or not user.check_password(password):
            return response.Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
        token, _ = Token.objects.get_or_create(user=user)
        return response.Response({'token': token.key, 'user': UserSerializer(user).data})


class ParagraphListCreateView(generics.ListCreateAPIView):
    serializer_class = ParagraphSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Paragraph.objects.filter(user=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        text = request.data.get('text', '').strip()
        if not text:
            return response.Response({'detail': 'Text is required.'}, status=status.HTTP_400_BAD_REQUEST)
        created_paragraphs = Paragraph.create_from_text(request.user, text)
        for paragraph in created_paragraphs:
            analyze_paragraph_text.delay(paragraph.id)
        serializer = self.get_serializer(created_paragraphs, many=True)
        return response.Response(serializer.data, status=status.HTTP_201_CREATED)


class SearchParagraphView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return response.Response([])

        paragraphs = Paragraph.objects.filter(user=request.user)
        scored = [
            (paragraph.count_word(query), paragraph)
            for paragraph in paragraphs
            if paragraph.count_word(query) > 0
        ]
        scored.sort(key=lambda item: (-item[0], -item[1].created_at.timestamp()))
        serializer = ParagraphSearchSerializer(
            [paragraph for _, paragraph in scored[:10]],
            many=True,
            context={'query': query},
        )
        return response.Response(serializer.data)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return response.Response(UserSerializer(request.user).data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return response.Response(serializer.data)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        if not current_password or not new_password:
            return response.Response(
                {'detail': 'Both current_password and new_password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = request.user
        if not user.check_password(current_password):
            return response.Response({'detail': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return response.Response({'detail': 'Password updated successfully.'})
