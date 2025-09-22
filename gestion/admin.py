from django.contrib import admin
from .models import Alumno, Docente, Grupo, GrupoMateria, Materia, Especialidad
from usuarios.models import Usuario
from django import forms

@admin.register(Alumno)
class AlumnoAdmin(admin.ModelAdmin):
    # si tu modelo Alumno tiene FK/OneToOne llamado 'usuario'
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "usuario":
            # Solo usuarios con rol alumno y que aún no estén ligados a un Alumno
            kwargs["queryset"] = (
                Usuario.objects
                .filter(rol="alumno")
                .filter(alumno__isnull=True)   # quita esta línea si no es OneToOne/único
            )
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

@admin.register(Docente)
class DocenteAdmin(admin.ModelAdmin):
    readonly_fields = ('usuario',)
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "usuario":
            kwargs["queryset"] = (
                Usuario.objects
                .filter(rol="docente")
                #.filter(docente__isnull=True)  # quita esta línea si no es OneToOne/único
            )
        return super().formfield_for_foreignkey(db_field, request, **kwargs)



# Register your models here.
admin.site.register(Grupo)
admin.site.register(GrupoMateria)
admin.site.register(Materia)
admin.site.register(Especialidad)