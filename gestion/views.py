from rest_framework import viewsets
from .serializers import GrupoSerializer, AlumnoSerializer, DocenteSerializer, MateriaSerializer, GrupoMateriaSerializer
from .models import Grupo, Materia, Alumno, Docente, GrupoMateria
# Create your views here.

class GrupoView(viewsets.ModelViewSet):
    serializer_class = GrupoSerializer
    queryset = Grupo.objects.all()
    
class MateriaView(viewsets.ModelViewSet):
    serializer_class = MateriaSerializer
    queryset = Materia.objects.all()

class AlumnoView(viewsets.ModelViewSet):
    serializer_class = AlumnoSerializer
    queryset = Alumno.objects.all()

class DocenteView(viewsets.ModelViewSet):
    serializer_class = DocenteSerializer
    queryset = Docente.objects.all()

class GrupoMateriaView(viewsets.ModelViewSet):
    serializer_class = GrupoMateriaSerializer
    queryset = GrupoMateria.objects.all()