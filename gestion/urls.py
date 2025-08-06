from rest_framework.routers import DefaultRouter
from .views import GrupoView, MateriaView, AlumnoView, DocenteView, GrupoMateriaView

#api versioning
router = DefaultRouter()
router.register(r'grupos', GrupoView)
router.register(r'alumnos', AlumnoView)
router.register(r'docentes', DocenteView)
router.register(r'materias', MateriaView)
router.register(r'grupomaterias', GrupoMateriaView)

urlpatterns = router.urls