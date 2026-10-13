from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, me
from django.urls import path

#api gestion
router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)

urlpatterns = [
    path('me/', me),
] + router.urls