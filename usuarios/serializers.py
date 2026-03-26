from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Usuario

User = get_user_model()

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "rol", "is_active", "password", "date_joined")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)  
        user.save()
        return user
        
        
# class UsuarioSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Usuario
#         fields = ['id', 'email', 'first_name', 'last_name', 'rol', 'is_active']