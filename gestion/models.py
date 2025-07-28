from django.db import models
from usuarios.models import Usuario

# Create your models here.
class Grupo(models.Model):
    
    TURNOS = (
        ('matutino', 'Matutino'),
        ('vespertino', 'Vespertino'),
    )
    
    nombre = models.CharField(max_length=50)
    grado = models.PositiveSmallIntegerField() #1 al 6
    turno = models.CharField(max_length=20, choices=TURNOS)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.nombre} - {self.grado}° - {self.turno}"
    
    
class Alumno(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    grupo = models.ForeignKey(Grupo, on_delete=models.SET_NULL, null=True, blank=True)
    matricula = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return f"{self.usuario.first_name} {self.usuario.last_name} - ({self.matricula}) - {self.grupo}"
    
    
class Docente(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    cedula = models.CharField(max_length=30)
    especialidad = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.usuario.first_name} {self.usuario.last_name} - {self.especialidad}"
    
    
class Materia(models.Model):
    nombre = models.CharField(max_length=100)
    clave = models.CharField(max_length=20, unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre
    
class GrupoMateria(models.Model):
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE)
    docente = models.ForeignKey(Docente, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('grupo', 'materia')
    
    def __str__(self):
        return f"{self.grupo} - {self.materia} ({self.docente})"