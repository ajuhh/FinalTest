import re
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, full_name, password=None, date_of_birth=None, **extra_fields):
        if not email:
            raise ValueError('The email field must be set.')
        if not full_name:
            raise ValueError('The full_name field must be set.')

        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, date_of_birth=date_of_birth, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, date_of_birth=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, full_name, password, date_of_birth=date_of_birth, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return self.full_name or self.email

    def get_full_name(self):
        return self.full_name

    def get_short_name(self):
        return self.full_name


class Paragraph(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='paragraphs')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Paragraph by {self.user.email} at {self.created_at:%Y-%m-%d %H:%M}'

    analysis_results = models.JSONField(null=True, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    @property
    def tokens(self):
        return [token for token in re.split(r'\s+', self.text.lower()) if token]

    def count_word(self, word):
        return self.tokens.count(word.lower())

    def word_frequencies(self):
        frequencies = {}
        for token in self.tokens:
            frequencies[token] = frequencies.get(token, 0) + 1
        return frequencies

    def update_analysis(self):
        self.analysis_results = self.word_frequencies()
        self.processed_at = timezone.now()
        self.save(update_fields=['analysis_results', 'processed_at'])

    @classmethod
    def create_from_text(cls, user, raw_text):
        paragraphs = [block.strip() for block in re.split(r'\n{2,}', raw_text) if block.strip()]
        created = [cls.objects.create(user=user, text=paragraph) for paragraph in paragraphs]
        return created
