from django.db import models

# Create your models here.
class MedicalRecord(models.Model):
    patient_id = models.IntegerField()
    doctor_id = models.IntegerField()
    appointment_id = models.IntegerField(null=True, blank=True)
    subject = models.CharField(max_length=200)
    content = models.TextField()
    diagnosis = models.TextField(null=True, blank=True)
    symtoms = models.TextField(null=True, blank=True)
    treatment = models.TextField(null=True, blank=True)
    prescription = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
