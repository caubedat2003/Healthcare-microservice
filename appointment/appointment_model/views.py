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


# New endpoints to fetch appointments by patient or doctor
class AppointmentByPatientAPIView(APIView):
    def get(self, request, patient_id: int):
        appointments = Appointment.objects.filter(patient_id=patient_id).order_by('-created_at')
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)


class AppointmentByDoctorAPIView(APIView):
    def get(self, request, doctor_id: int):
        appointments = Appointment.objects.filter(doctor_id=doctor_id).order_by('-created_at')
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)


class AppointmentDetailAPIView(APIView):
    def get_object(self, appointment_id):
        try:
            return Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return None

    def get(self, request, appointment_id):
        appointment = self.get_object(appointment_id)
        if not appointment:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)

    def put(self, request, appointment_id):
        appointment = self.get_object(appointment_id)
        if not appointment:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = AppointmentSerializer(appointment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, appointment_id):
        appointment = self.get_object(appointment_id)
        if not appointment:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, appointment_id):
        appointment = self.get_object(appointment_id)
        if not appointment:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
        appointment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
