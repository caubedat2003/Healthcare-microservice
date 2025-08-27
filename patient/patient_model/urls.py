from django.urls import path
from patient_model.views import PatientListCreateAPIView, PatientDetailAPIView, PatientByUserAPIView, PatientSearchAPIView

urlpatterns = [
    path('api/patient/', PatientListCreateAPIView.as_view(), name='patient-list-create'),
    path('api/patient/<int:patient_id>/', PatientDetailAPIView.as_view(), name='patient-detail'),
    path('api/patient/user/<int:user_id>/', PatientByUserAPIView.as_view(), name='patient-by-user'),
    path('api/patient/search/', PatientSearchAPIView.as_view(), name='patient-search'),
]