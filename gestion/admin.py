from django.contrib import admin
from .models import Alumno, Docente, Grupo, GrupoMateria, Materia

# Register your models here.
admin.site.register(Alumno)
admin.site.register(Docente)
admin.site.register(Grupo)
admin.site.register(GrupoMateria)
admin.site.register(Materia)