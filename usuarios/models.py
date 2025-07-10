from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.db import models

class UsuarioManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        if not password:
            raise ValueError('La contraseña es obligatoria')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('El superusuario debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('El superusuario debe tener is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class Usuario(AbstractUser):
    ROLES = (
        ('admin', 'Administrador'),
        ('docente', 'Docente'),
        ('alumno', 'Alumno'),
    )

    username = None
    email = models.EmailField(unique=True)
    first_name = models.CharField("Nombre(s)", max_length=100)
    last_name = models.CharField("Apellido(s)", max_length=100)
    rol = models.CharField(max_length=10, choices=ROLES)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'rol'] 

    objects = UsuarioManager()
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.rol})"