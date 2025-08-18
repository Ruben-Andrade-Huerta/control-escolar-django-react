from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Subquery, OuterRef

from .serializers import GrupoSerializer, AlumnoSerializer, DocenteSerializer, MateriaSerializer, GrupoMateriaSerializer
from .models import Grupo, Materia, Alumno, Docente, GrupoMateria

from usuarios.permissions import IsAdminRole, IsDocenteRole, IsAlumnoRole, ReadOnly

# --------- Helpers de obtención segura ----------
def _get_docente_from_user(user):
    # Regresa instancia Docente o None
    try:
        return Docente.objects.get(usuario=user)
    except Docente.DoesNotExist:
        return None

def _get_alumno_from_user(user):
    # Regresa instancia Alumno o None
    try:
        return Alumno.objects.get(usuario=user)
    except Alumno.DoesNotExist:
        return None

# ===============================================
class GrupoView(viewsets.ModelViewSet):
    serializer_class = GrupoSerializer
    queryset = Grupo.objects.all()
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminRole()]
        # Lectura para todos los roles autenticados, pero filtrada
        return [IsAuthenticated(), ReadOnly()]

    def get_queryset(self):
        user = self.request.user
        rol = getattr(user, 'rol', None)

        if rol == 'admin':
            return Grupo.objects.all()

        if rol == 'docente':
            docente = _get_docente_from_user(user)
            if not docente:
                return Grupo.objects.none()
            # Grupos asignados al docente vía GrupoMateria (cualquier materia)
            gm_grupos = GrupoMateria.objects.filter(docente=docente, is_active=True).values('grupo_id')
            return Grupo.objects.filter(id__in=Subquery(gm_grupos)).distinct()

        if rol == 'alumno':
            alumno = _get_alumno_from_user(user)
            if not alumno or not alumno.grupo_id:
                return Grupo.objects.none()
            return Grupo.objects.filter(pk=alumno.grupo_id)
        return Grupo.objects.none()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # No permitir eliminar si hay relaciones:
        if Alumno.objects.filter(grupo=instance).exists():
            return Response({"detail": "No se puede eliminar: hay alumnos en este grupo."},
                            status=status.HTTP_400_BAD_REQUEST)
        if GrupoMateria.objects.filter(grupo=instance).exists():
            return Response({"detail": "No se puede eliminar: hay relaciones Grupo-Materia."},
                            status=status.HTTP_400_BAD_REQUEST)
        # Futuro: validar calificaciones/asistencias asociadas al grupo
        return super().destroy(request, *args, **kwargs)

# ===============================================
class MateriaView(viewsets.ModelViewSet):
    serializer_class = MateriaSerializer
    queryset = Materia.objects.all()
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminRole()]
        return [IsAuthenticated(), ReadOnly()]

    def get_queryset(self):
        user = self.request.user
        rol = getattr(user, 'rol', None)

        if rol == 'admin':
            return Materia.objects.all()

        if rol == 'docente':
            docente = _get_docente_from_user(user)
            if not docente:
                return Materia.objects.none()
            gm_mats = GrupoMateria.objects.filter(docente=docente, is_active=True).values('materia_id')
            return Materia.objects.filter(id__in=Subquery(gm_mats)).distinct()

        if rol == 'alumno':
            alumno = _get_alumno_from_user(user)
            if not alumno or not alumno.grupo_id:
                return Materia.objects.none()
            gm_mats = GrupoMateria.objects.filter(grupo_id=alumno.grupo_id, is_active=True).values('materia_id')
            return Materia.objects.filter(id__in=Subquery(gm_mats)).distinct()

        return Materia.objects.none()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if GrupoMateria.objects.filter(materia=instance).exists():
            return Response({"detail": "No se puede eliminar: la materia está asignada a grupos/docentes."},
                            status=status.HTTP_400_BAD_REQUEST)
        # Futuro: validar calificaciones ligadas a la materia
        return super().destroy(request, *args, **kwargs)

# ===============================================
class AlumnoView(viewsets.ModelViewSet):
    serializer_class = AlumnoSerializer
    queryset = Alumno.objects.all()
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # Admin: CRUD. Docente/Alumno: solo lectura; Alumno solo puede verse a sí mismo.
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminRole()]
        return [IsAuthenticated(), ReadOnly()]

    def get_queryset(self):
        user = self.request.user
        rol = getattr(user, 'rol', None)

        if rol == 'admin':
            return Alumno.objects.all()

        if rol == 'docente':
            docente = _get_docente_from_user(user)
            if not docente:
                return Alumno.objects.none()
            # Alumnos de los grupos donde el docente está asignado (vía GrupoMateria activa)
            gm_grupos = GrupoMateria.objects.filter(docente=docente, is_active=True).values('grupo_id')
            return Alumno.objects.filter(grupo_id__in=Subquery(gm_grupos)).distinct()

        if rol == 'alumno':
            alumno = _get_alumno_from_user(user)
            if not alumno:
                return Alumno.objects.none()
            return Alumno.objects.filter(pk=alumno.pk)

        return Alumno.objects.none()

# ===============================================
class DocenteView(viewsets.ModelViewSet):
    serializer_class = DocenteSerializer
    queryset = Docente.objects.all()
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # Solo admin puede crear/editar/eliminar/listar docentes
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'list']:
            return [IsAuthenticated(), IsAdminRole()]
        # retrieve: docente puede verse a sí mismo; admin cualquiera
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'rol', None) == 'admin':
            return Docente.objects.all()
        # Permitir que el docente vea su propio objeto para retrieve
        docente = _get_docente_from_user(user)
        if docente:
            return Docente.objects.filter(pk=docente.pk)
        return Docente.objects.none()
        # # Docente/Alumno no pueden listar (bloqueado en get_permissions)
        # return Docente.objects.none()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if getattr(request.user, 'rol', None) == 'admin':
            return super().retrieve(request, *args, **kwargs)
        docente = _get_docente_from_user(request.user)
        if not docente or docente.pk != instance.pk:
            return Response({"detail": "No tienes permiso para ver este docente."},
                            status=status.HTTP_403_FORBIDDEN)
        return super().retrieve(request, *args, **kwargs)

# ===============================================
class GrupoMateriaView(viewsets.ModelViewSet):
    serializer_class = GrupoMateriaSerializer
    queryset = GrupoMateria.objects.all()
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # Admin: CRUD completo
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminRole()]
        # Docente/Alumno: solo lectura
        return [IsAuthenticated(), ReadOnly()]

    def get_queryset(self):
        user = self.request.user
        rol = getattr(user, 'rol', None)

        if rol == 'admin':
            # Admin puede ver activas e inactivas
            return GrupoMateria.objects.all()

        if rol == 'docente':
            docente = _get_docente_from_user(user)
            if not docente:
                return GrupoMateria.objects.none()
            return GrupoMateria.objects.filter(docente=docente, is_active=True)

        if rol == 'alumno':
            alumno = _get_alumno_from_user(user)
            if not alumno or not alumno.grupo_id:
                return GrupoMateria.objects.none()
            return GrupoMateria.objects.filter(grupo_id=alumno.grupo_id, is_active=True)

        return GrupoMateria.objects.none()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Restricciones de eliminación: para Calificacion/Asistencia ligadas a este GM, bloquear.
        # if Calificacion.objects.filter(grupo=instance.grupo, materia=instance.materia, docente=instance.docente).exists():
        #     return Response({"detail": "No se puede eliminar: existen calificaciones asociadas."}, status=status.HTTP_400_BAD_REQUEST)
        # if Asistencia.objects.filter(grupo=instance.grupo, materia=instance.materia, docente=instance.docente).exists():
        #     return Response({"detail": "No se puede eliminar: existen asistencias asociadas."}, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)