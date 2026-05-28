from django.urls import path
from .views import (
    ChangePasswordView,
    LoginView,
    ParagraphListCreateView,
    ProfileView,
    RegisterView,
    SearchParagraphView,
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('paragraphs/', ParagraphListCreateView.as_view(), name='paragraphs'),
    path('paragraphs/search/', SearchParagraphView.as_view(), name='search_paragraphs'),
    path('profile/', ProfileView.as_view(), name='profile'),
]
