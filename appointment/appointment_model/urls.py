from django.urls import path
from .views import AppointmentListCreateAPIView

urlpatterns = [
    path('api/appointment/', AppointmentListCreateAPIView.as_view(), name='appointment-list-create'),
    # path('api/appointment/<int:appointment_id>/', AppointmentDetailAPIView.as_view(), name='appointment-detail'),
]