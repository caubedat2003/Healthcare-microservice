from django.db import models

# Create your models here.
class Appointment(models.Model):
    patient_id = models.IntegerField()  # Ref to patient_service
    doctor_id = models.IntegerField()   # Ref to doctor_service
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    status = models.CharField(max_length=20, default='pending')  # pending, confirmed, canceled, done
    reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)