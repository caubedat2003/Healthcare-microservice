# auth_service/views.py
import requests
from django.db import transaction
from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

PATIENT_SERVICE_URL = "http://patient_service:8000/api/patient/"  # endpoint tạo patient
DOCTOR_SERVICE_URL = "http://doctor_service:8000/api/doctor/"

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


class CreateAccountView(APIView):
    """Admin-only endpoint to create users with a specified role (patient|doctor|admin).

    Behavior:
    - Creates the User record.
    - If role == 'patient': calls patient service to create patient record.
    - If role == 'doctor': calls doctor service to create doctor record.
    - If role == 'admin': sets is_staff and is_superuser on the user.
    - On downstream failure, rolls back (deletes) the created User and returns error.
    """
    permission_classes = [IsAdminUser]

    def post(self, request):
        from .serializers import CreateAccountSerializer

        serializer = CreateAccountSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Create user
        try:
            with transaction.atomic():
                user = serializer.save()
        except Exception as e:
            return Response({"error": "Failed to create user", "details": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        role = getattr(user, "role", "patient")

        # If admin role, promote and return
        if role == "admin":
            try:
                user.is_staff = True
                user.is_superuser = True
                user.save()
            except Exception as e:
                user.delete()
                return Response({"error": "Failed to set admin flags", "details": str(e)},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({"message": "Admin user created", "user_id": user.id}, status=status.HTTP_201_CREATED)

        # Prepare payload for downstream service
        downstream_payload = {
            "user_id": user.id,
            "full_name": getattr(user, "full_name", ""),
            "created_at": user.created_at.isoformat() if user.created_at else None
        }

        target_url = PATIENT_SERVICE_URL if role == "patient" else DOCTOR_SERVICE_URL

        try:
            resp = requests.post(target_url, json=downstream_payload, headers={"Host": "localhost"}, timeout=5)
        except requests.RequestException as exc:
            user.delete()
            return Response({"error": f"{role.capitalize()} service unreachable", "details": str(exc)},
                            status=status.HTTP_503_SERVICE_UNAVAILABLE)

        if resp.status_code not in (200, 201):
            user.delete()
            try:
                detail = resp.json()
            except Exception:
                detail = resp.text
            return Response({"error": f"Failed to create {role} record", f"{role}_service_response": detail},
                            status=status.HTTP_502_BAD_GATEWAY)

        try:
            created_data = resp.json()
        except ValueError:
            created_data = {"raw": resp.text}

        return Response({"message": f"User and {role} record created", "user_id": user.id, role: created_data}, status=status.HTTP_201_CREATED)


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


class UserSearchAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        q = request.query_params.get('q')
        full_name = request.query_params.get('full_name')
        email = request.query_params.get('email')

        if not (q or full_name or email):
            return Response({'error': 'Provide query param q or full_name or email'}, status=status.HTTP_400_BAD_REQUEST)

        filters = Q()
        if q:
            filters |= Q(full_name__icontains=q) | Q(email__icontains=q)
        if full_name:
            filters |= Q(full_name__icontains=full_name)
        if email:
            filters |= Q(email__icontains=email)

        users = User.objects.filter(filters).order_by('-created_at')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]  # Cho phép truy cập không cần xác thực
    
    queryset = User.objects.all().order_by("-created_at")
    serializer_class = UserSerializer