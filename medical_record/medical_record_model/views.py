from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import MedicalRecord
from .serializers import MedicalRecordSerializer
import requests

# API để lấy danh sách tất cả medical records hoặc tạo mới
class MedicalRecordListCreateAPIView(APIView):
    def get(self, request):
        records = MedicalRecord.objects.all()
        serializer = MedicalRecordSerializer(records, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        patient_id = data.get("patient_id")
        doctor_id = data.get("doctor_id")
        appointment_id = data.get("appointment_id")

        # Gọi nội bộ tới patient_service
        patient_response = requests.get(
            f"http://patient_service:8000/api/patient/{patient_id}/",
            headers={'Host': 'localhost'}
        )
        if patient_response.status_code != 200:
            return Response({"error": "Invalid patient"}, status=status.HTTP_400_BAD_REQUEST)

        # Gọi nội bộ tới doctor_service
        doctor_response = requests.get(
            f"http://doctor_service:8000/api/doctor/{doctor_id}/",
            headers={'Host': 'localhost'}
        )
        if doctor_response.status_code != 200:
            return Response({"error": "Invalid doctor"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Nếu có appointment_id, kiểm tra tính hợp lệ
        if appointment_id:
            appointment_response = requests.get(
                f"http://appointment_service:8000/api/appointment/{appointment_id}/",
                headers={'Host': 'localhost'}
            )
            if appointment_response.status_code != 200:
                return Response({"error": "Invalid appointment"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = MedicalRecordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API để lấy chi tiết, cập nhật hoặc xóa medical record
class MedicalRecordDetailAPIView(APIView):
    def get_object(self, record_id):
        try:
            return MedicalRecord.objects.get(id=record_id)
        except MedicalRecord.DoesNotExist:
            return None

    def get(self, request, record_id):
        record = self.get_object(record_id)
        if not record:
            return Response({"error": "Medical record not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = MedicalRecordSerializer(record)
        return Response(serializer.data)

    def put(self, request, record_id):
        record = self.get_object(record_id)
        if not record:
            return Response({"error": "Medical record not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data
        patient_id = data.get("patient_id")
        doctor_id = data.get("doctor_id")
        appointment_id = data.get("appointment_id")

        # Gọi nội bộ tới patient_service
        if patient_id:
            patient_response = requests.get(
                f"http://patient_service:8000/api/patient/{patient_id}/",
                headers={'Host': 'localhost'}
            )
            if patient_response.status_code != 200:
                return Response({"error": "Invalid patient"}, status=status.HTTP_400_BAD_REQUEST)

        # Gọi nội bộ tới doctor_service
        if doctor_id:
            doctor_response = requests.get(
                f"http://doctor_service:8000/api/doctor/{doctor_id}/",
                headers={'Host': 'localhost'}
            )
            if doctor_response.status_code != 200:
                return Response({"error": "Invalid doctor"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Nếu có appointment_id, kiểm tra tính hợp lệ
        if appointment_id:
            appointment_response = requests.get(
                f"http://appointment_service:8000/api/appointment/{appointment_id}/",
                headers={'Host': 'localhost'}
            )
            if appointment_response.status_code != 200:
                return Response({"error": "Invalid appointment"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = MedicalRecordSerializer(record, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, record_id):
        record = self.get_object(record_id)
        if not record:
            return Response({"error": "Medical record not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data
        patient_id = data.get("patient_id")
        doctor_id = data.get("doctor_id")
        appointment_id = data.get("appointment_id")

        # Gọi nội bộ tới patient_service
        if patient_id:
            patient_response = requests.get(
                f"http://patient_service:8000/api/patient/{patient_id}/",
                headers={'Host': 'localhost'}
            )
            if patient_response.status_code != 200:
                return Response({"error": "Invalid patient"}, status=status.HTTP_400_BAD_REQUEST)

        # Gọi nội bộ tới doctor_service
        if doctor_id:
            doctor_response = requests.get(
                f"http://doctor_service:8000/api/doctor/{doctor_id}/",
                headers={'Host': 'localhost'}
            )
            if doctor_response.status_code != 200:
                return Response({"error": "Invalid doctor"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Nếu có appointment_id, kiểm tra tính hợp lệ
        if appointment_id:
            appointment_response = requests.get(
                f"http://appointment_service:8000/api/appointment/{appointment_id}/",
                headers={'Host': 'localhost'}
            )
            if appointment_response.status_code != 200:
                return Response({"error": "Invalid appointment"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = MedicalRecordSerializer(record, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, record_id):
        record = self.get_object(record_id)
        if not record:
            return Response({"error": "Medical record not found"}, status=status.HTTP_404_NOT_FOUND)
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
# API để lấy tất cả bản ghi y tế của một bệnh nhân
class MedicalRecordByPatientAPIView(APIView):
    def get(self, request, patient_id):
        # Gọi nội bộ tới patient_service để kiểm tra patient_id
        patient_response = requests.get(
            f"http://patient_service:8000/api/patient/{patient_id}/",
            headers={'Host': 'localhost'}
        )
        if patient_response.status_code != 200:
            return Response({"error": "Invalid patient"}, status=status.HTTP_400_BAD_REQUEST)

        # Lọc bản ghi y tế theo patient_id
        records = MedicalRecord.objects.filter(patient_id=patient_id)
        if not records.exists():
            return Response(
                {"error": f"No medical records found for patient ID: {patient_id}"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = MedicalRecordSerializer(records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# API để lấy tất cả bản ghi y tế của một bác sĩ
class MedicalRecordByDoctorAPIView(APIView):
    def get(self, request, doctor_id):
        # Gọi nội bộ tới doctor_service để kiểm tra doctor_id
        doctor_response = requests.get(
            f"http://doctor_service:8000/api/doctor/{doctor_id}/",
            headers={'Host': 'localhost'}
        )
        if doctor_response.status_code != 200:
            return Response({"error": "Invalid doctor"}, status=status.HTTP_400_BAD_REQUEST)

        # Lọc bản ghi y tế theo doctor_id
        records = MedicalRecord.objects.filter(doctor_id=doctor_id)
        if not records.exists():
            return Response(
                {"error": f"No medical records found for doctor ID: {doctor_id}"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = MedicalRecordSerializer(records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)