# auth_service/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, UserViewSet

router = DefaultRouter()
router.register(r'api/auth/users', UserViewSet, basename='user')

urlpatterns = [
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/login/", LoginView.as_view(), name="login"),
    path("", include(router.urls)),
]
