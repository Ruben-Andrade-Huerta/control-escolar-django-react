from django.db import models

# Create your models here.
class Grupo(models.Model):
    
    TURNOS = (
        ('matutino', 'Matutino'),
        ('vespertino', 'Vespertino'),
    )
    
    nombre = models.CharField(max_length=50)
    grado = models.PositiveSmallIntegerField() #1 al 6
    turno = models.CharField(max_length=20, choices=TURNOS)
    
    def __str__(self):
        return f"{self.nombre} - {self.grado}° {self.turno}"