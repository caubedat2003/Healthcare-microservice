from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Patient
from .serializers import PatientSerializer
from django.db.models import Q

# API để lấy danh sách tất cả bệnh nhân hoặc tạo bệnh nhân mới
class PatientListCreateAPIView(APIView):
    def get(self, request):
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API để lấy chi tiết, cập nhật hoặc xóa một bệnh nhân
class PatientDetailAPIView(APIView):
    def get_object(self, patient_id):
        try:
            return Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return None

    def get(self, request, patient_id):
        patient = self.get_object(patient_id)
        if not patient:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PatientSerializer(patient)
        return Response(serializer.data)

    def put(self, request, patient_id):
        patient = self.get_object(patient_id)
        if not patient:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PatientSerializer(patient, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, patient_id):
        patient = self.get_object(patient_id)
        if not patient:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PatientSerializer(patient, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, patient_id):
        patient = self.get_object(patient_id)
        if not patient:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)
        patient.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# New: get patient by user_id
class PatientByUserAPIView(APIView):
    def get(self, request, user_id: int):
        try:
            patient = Patient.objects.get(user_id=user_id)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found for this user"}, 
                            status=status.HTTP_404_NOT_FOUND)
        serializer = PatientSerializer(patient)
        return Response(serializer.data)

# New: search patients by name or phone
class PatientSearchAPIView(APIView):
    def get(self, request):
        q = request.query_params.get('q')
        full_name = request.query_params.get('full_name')
        phone = request.query_params.get('phone_number')

        if not (q or full_name or phone):
            return Response({'error': 'Provide query param q or full_name or phone_number'}, status=status.HTTP_400_BAD_REQUEST)

        filters = Q()
        if q:
            filters |= Q(full_name__icontains=q) | Q(phone_number__icontains=q)
        if full_name:
            filters |= Q(full_name__icontains=full_name)
        if phone:
            filters |= Q(phone_number__icontains=phone)

        patients = Patient.objects.filter(filters)
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)