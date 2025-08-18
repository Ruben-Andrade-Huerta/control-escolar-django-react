from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet

#api gestion
router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)

urlpatterns = router.urls