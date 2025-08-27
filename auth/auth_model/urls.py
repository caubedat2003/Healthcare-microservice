# auth_service/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, UserViewSet, CreateAccountView, UserSearchAPIView

router = DefaultRouter()
router.register(r'api/auth/users', UserViewSet, basename='user')

urlpatterns = [
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/login/", LoginView.as_view(), name="login"),
    path("api/auth/create-account/", CreateAccountView.as_view(), name="create-account"),
    path("api/auth/users/search/", UserSearchAPIView.as_view(), name="user-search"),
    path("", include(router.urls)),
]
