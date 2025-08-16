from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import UsuarioSerializer

from usuarios.permissions import IsAdminRole, IsDocenteRole, IsAlumnoRole, ReadOnly

# Ajusta el import del serializer real que uses para Usuario:
# from .serializers import UsuarioSerializer

Usuario = get_user_model()

class UsuarioViewSet(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer  
    queryset = Usuario.objects.all()
    permission_classes = [IsAuthenticated]  

    def get_permissions(self):
        # Admin: todo. Docente/Alumno: solo lectura; y edición SOLO de sí mismos.
        if self.action in ['create', 'destroy', 'list']:
            return [IsAuthenticated(), IsAdminRole()]
        elif self.action in ['update', 'partial_update']:
            # Admin puede editar a cualquiera; otros solo a sí mismos (se valida en perform_update)
            return [IsAuthenticated()]
        elif self.action in ['retrieve']:
            return [IsAuthenticated()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'rol', None) == 'admin':
            return Usuario.objects.all()
        # Docente/Alumno: no pueden listar (se bloquea en get_permissions), pero por seguridad:
        return Usuario.objects.none()

    def retrieve(self, request, *args, **kwargs):
        # Admin puede ver a cualquiera; otros solo a sí mismos
        instance = self.get_object()
        if getattr(request.user, 'rol', None) != 'admin' and instance.pk != request.user.pk:
            return Response({"detail": "No tienes permiso para ver este usuario."}, status=status.HTTP_403_FORBIDDEN)
        return super().retrieve(request, *args, **kwargs)

    def perform_update(self, serializer):
        # Admin: sin restricción. Otros: solo a sí mismos
        instance = self.get_object()
        user = self.request.user
        if getattr(user, 'rol', None) != 'admin' and instance.pk != user.pk:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("No puedes modificar otros usuarios.")
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        # Solo Admin (ya filtrado en get_permissions). Restringe si tiene relaciones.
        instance = self.get_object()
        # Bloqueos básicos (ajusta a tus relaciones reales):
        # Si existe un Alumno/Docente ligado o registros derivados, no permitir eliminar.
        from gestion.models import Alumno, Docente, GrupoMateria  # evita importaciones circulares con esto aquí
        tiene_alumno = Alumno.objects.filter(usuario=instance).exists()
        tiene_docente = Docente.objects.filter(usuario=instance).exists()
        if tiene_alumno or tiene_docente:
            return Response(
                {"detail": "No se puede eliminar: el usuario está relacionado con Alumno/Docente."},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Futuro: checar calificaciones/asistencias/auditlog aquí.
        return super().destroy(request, *args, **kwargs)
