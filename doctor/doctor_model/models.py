from django.db import models

# Create your models here.
class Doctor(models.Model):
    user_id = models.IntegerField(unique=True)  # Ref to auth_service
    full_name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    years_of_experience = models.IntegerField()
    license_number = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)