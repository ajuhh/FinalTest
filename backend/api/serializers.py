from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Paragraph

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'date_of_birth', 'date_joined', 'updated_at']
        read_only_fields = ['id', 'date_joined', 'updated_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'full_name', 'date_of_birth', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ParagraphSerializer(serializers.ModelSerializer):
    word_count = serializers.SerializerMethodField()

    class Meta:
        model = Paragraph
        fields = ['id', 'text', 'created_at', 'updated_at', 'word_count']
        read_only_fields = ['id', 'created_at', 'updated_at', 'word_count']

    def get_word_count(self, obj):
        return len(obj.tokens)


class ParagraphSearchSerializer(ParagraphSerializer):
    count = serializers.SerializerMethodField()

    class Meta(ParagraphSerializer.Meta):
        fields = ParagraphSerializer.Meta.fields + ['count']

    def get_count(self, obj):
        query = self.context.get('query', '')
        return obj.count_word(query) if query else 0
