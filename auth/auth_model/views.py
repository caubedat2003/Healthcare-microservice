# auth_service/views.py
import requests
from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

PATIENT_SERVICE_URL = "http://patient_service:8000/api/patient/"  # endpoint tạo patient

class RegisterView(APIView):
    """
    Tạo user (role mặc định = 'patient' trong serializer),
    sau đó gọi patient_service để tạo record Patient.
    Nếu tạo patient thất bại, xóa user (rollback) và trả lỗi.
    """
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Lưu user trước
        try:
            with transaction.atomic():
                user = serializer.save()  # create_user => user đã lưu vào DB
        except Exception as e:
            return Response({"error": "Failed to create user", "details": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Chuẩn bị payload cho patient_service (chỉ map những trường có sẵn)
        patient_payload = {
            "user_id": user.id,
            "full_name": getattr(user, "full_name", ""),
            "email": getattr(user, "email", ""),
        }

        # Gọi patient_service
        try:
            resp = requests.post(
                PATIENT_SERVICE_URL,
                json=patient_payload,
                headers={"Host": "localhost"},  # giữ theo snippet của bạn nếu cần
                timeout=5
            )
        except requests.RequestException as exc:
            # Không thể reach patient_service => rollback user
            user.delete()
            return Response({"error": "Patient service unreachable", "details": str(exc)},
                            status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # Nếu patient_service trả mã lỗi => rollback user
        if resp.status_code not in (200, 201):
            # xóa user vừa tạo
            user.delete()
            # trả lỗi chi tiết từ patient_service để debug
            try:
                detail = resp.json()
            except Exception:
                detail = resp.text
            return Response({"error": "Failed to create patient record",
                             "patient_service_response": detail},
                            status=status.HTTP_502_BAD_GATEWAY)

        # Thành công: parse thông tin patient trả về (vd chứa id)
        try:
            patient_data = resp.json()
        except ValueError:
            patient_data = {"raw": resp.text}

        # Tạo token JWT và trả về
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Registered and patient record created",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "patient": patient_data
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful",
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]  # Cho phép truy cập không cần xác thực
    
    queryset = User.objects.all().order_by("-created_at")
    serializer_class = UserSerializer