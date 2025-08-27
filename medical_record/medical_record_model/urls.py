from django.urls import path
from .views import (
    MedicalRecordListCreateAPIView,
    MedicalRecordDetailAPIView,
    MedicalRecordByPatientAPIView,
    MedicalRecordByDoctorAPIView
)


urlpatterns = [
    path('api/medical-records/', MedicalRecordListCreateAPIView.as_view(), name='medical-record-list-create'),
    path('api/medical-records/<int:record_id>/', MedicalRecordDetailAPIView.as_view(), name='medical-record-detail'),
    path('api/medical-records/patient/<int:patient_id>/', MedicalRecordByPatientAPIView.as_view(), name='medical-record-by-patient'),
    path('api/medical-records/doctor/<int:doctor_id>/', MedicalRecordByDoctorAPIView.as_view(), name='medical-record-by-doctor'),
]