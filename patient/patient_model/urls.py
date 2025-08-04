from django.urls import path
from patient_model.views import PatientListCreateAPIView, PatientDetailAPIView

urlpatterns = [
    path('api/patient/', PatientListCreateAPIView.as_view(), name='patient-list-create'),
    path('api/patient/<int:patient_id>/', PatientDetailAPIView.as_view(), name='patient-detail'),
]