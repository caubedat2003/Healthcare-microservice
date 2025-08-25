from django.urls import path
from .views import DoctorListCreateAPIView, DoctorDetailAPIView, DoctorBySpecializationAPIView, DoctorByUserAPIView

urlpatterns = [
    path('api/doctor/', DoctorListCreateAPIView.as_view(), name='doctor-list-create'),
    path('api/doctor/<int:doctor_id>/', DoctorDetailAPIView.as_view(), name='doctor-detail'),
    path('api/doctor/specialization/<str:specialization>/', DoctorBySpecializationAPIView.as_view(), name='doctor-by-specialization'),
    path('api/doctor/user/<int:user_id>/', DoctorByUserAPIView.as_view(), name='doctor-by-user'),
]