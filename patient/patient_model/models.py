from django.db import models

# Create your models here.
class Patient(models.Model):
    user_id = models.IntegerField(unique=True)  # Ref to auth_service
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10)  # Male / Female / Other
    phone_number = models.CharField(max_length=20)
    address = models.TextField()
    blood_type = models.CharField(max_length=3, null=True, blank=True)  # A+, O-, etc.
    medical_history = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)