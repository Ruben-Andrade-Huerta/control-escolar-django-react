from rest_framework.routers import DefaultRouter
from .views import UsuarioView

#api gestion
router = DefaultRouter()
router.register(r'usuarios', UsuarioView)

urlpatterns = router.urls