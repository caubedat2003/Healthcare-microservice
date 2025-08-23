from django.urls import path
from .views import AppointmentListCreateAPIView, AppointmentByPatientAPIView, AppointmentByDoctorAPIView, AppointmentDetailAPIView

urlpatterns = [
    path('api/appointment/', AppointmentListCreateAPIView.as_view(), name='appointment-list-create'),
    path('api/appointment/patient/<int:patient_id>/', AppointmentByPatientAPIView.as_view(), name='appointment-by-patient'),
    path('api/appointment/doctor/<int:doctor_id>/', AppointmentByDoctorAPIView.as_view(), name='appointment-by-doctor'),
    path('api/appointment/<int:appointment_id>/', AppointmentDetailAPIView.as_view(), name='appointment-detail'),
]