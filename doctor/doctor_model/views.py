from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Doctor
from .serializers import DoctorSerializer
from django.db.models import Q

# API để lấy danh sách tất cả bác sĩ hoặc tạo bác sĩ mới
class DoctorListCreateAPIView(APIView):
    def get(self, request):
        doctors = Doctor.objects.all()
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = DoctorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API để lấy chi tiết, cập nhật hoặc xóa một bác sĩ
class DoctorDetailAPIView(APIView):
    def get_object(self, doctor_id):
        try:
            return Doctor.objects.get(id=doctor_id)
        except Doctor.DoesNotExist:
            return None

    def get(self, request, doctor_id):
        doctor = self.get_object(doctor_id)
        if not doctor:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = DoctorSerializer(doctor)
        return Response(serializer.data)

    def put(self, request, doctor_id):
        doctor = self.get_object(doctor_id)
        if not doctor:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = DoctorSerializer(doctor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, doctor_id):
        doctor = self.get_object(doctor_id)
        if not doctor:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = DoctorSerializer(doctor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, doctor_id):
        doctor = self.get_object(doctor_id)
        if not doctor:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        doctor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
# API để lấy danh sách bác sĩ theo chuyên môn
class DoctorBySpecializationAPIView(APIView):
    def get(self, request, specialization):
        # Danh sách các chuyên môn hợp lệ
        valid_specializations = [
            'Emergency', 'Cardiology', 'Pediatric', 'Gynecology', 'Neurology', 'Psychiatry'
        ]
        
        # Kiểm tra xem specialization có hợp lệ không
        if specialization not in valid_specializations:
            return Response(
                {"error": f"Invalid specialization. Must be one of: {', '.join(valid_specializations)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Lọc bác sĩ theo chuyên môn
        doctors = Doctor.objects.filter(specialization=specialization)
        if not doctors.exists():
            return Response(
                {"error": f"No doctors found for specialization: {specialization}"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# API để lấy bác sĩ theo user_id
class DoctorByUserAPIView(APIView):
    def get(self, request, user_id: int):
        try:
            doctor = Doctor.objects.get(user_id=user_id)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor not found for this user"}, 
                            status=status.HTTP_404_NOT_FOUND)
        serializer = DoctorSerializer(doctor)
        return Response(serializer.data)

# API để tìm kiếm bác sĩ theo q, full_name hoặc phone_number
class DoctorSearchAPIView(APIView):
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

        doctors = Doctor.objects.filter(filters)
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)