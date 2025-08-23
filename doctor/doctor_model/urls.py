from django.urls import path
from .views import DoctorListCreateAPIView, DoctorDetailAPIView, DoctorBySpecializationAPIView

urlpatterns = [
    path('api/doctor/', DoctorListCreateAPIView.as_view(), name='doctor-list-create'),
    path('api/doctor/<int:doctor_id>/', DoctorDetailAPIView.as_view(), name='doctor-detail'),
    path('api/doctor/specialization/<str:specialization>/', DoctorBySpecializationAPIView.as_view(), name='doctor-by-specialization'),
]