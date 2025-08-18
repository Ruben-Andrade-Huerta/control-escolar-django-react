from rest_framework import serializers
from .models import Grupo, Materia, Docente, Alumno, GrupoMateria

class GrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grupo
        fields = ['nombre', 'grado', 'turno', 'is_active']
        
class MateriaSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Materia
        fields = ['nombre', 'clave', 'is_active']
        
class DocenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Docente
        fields = ['usuario', 'cedula', 'especialidad']
        
class AlumnoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumno
        fields = ['usuario', 'grupo', 'matricula']
        
class GrupoMateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrupoMateria
        fields = ['grupo', 'materia', 'docente', 'is_active']