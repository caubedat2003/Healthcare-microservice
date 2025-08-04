import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Appointment
from .serializers import AppointmentSerializer

class AppointmentListCreateAPIView(APIView):
    def get(self, request):
        appointments = Appointment.objects.all()
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        patient_id = data.get("patient_id")
        doctor_id = data.get("doctor_id")

        # Gọi nội bộ
        patient_response = requests.get(
            f"http://patient_service:8000/api/patient/{patient_id}/",
            headers={'Host': 'localhost'}
        )

        if patient_response.status_code != 200:
            return Response({"error": "Invalid patient"}, status=400)

        # Gọi nội bộ
        doctor_response = requests.get(
            f"http://doctor_service:8000/api/doctor/{doctor_id}/",
            headers={'Host': 'localhost'}
        )
        
        if doctor_response.status_code != 200:
            return Response({"error": "Invalid doctor"}, status=400)

        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
