#!/bin/bash
echo "Running makemigrations and migrate for patient_service..."
docker-compose exec -T patient_service python manage.py migrate
echo "Running makemigrations and migrate for doctor_service..."
docker-compose exec -T doctor_service python manage.py migrate
echo "Running makemigrations and migrate for appointment_service..."
docker-compose exec -T appointment_service python manage.py migrate
echo "Running makemigrations and migrate for auth_service..."
docker-compose exec -T auth_service python manage.py migrate
echo "Running makemigrations and migrate for medical_record_service..."
docker-compose exec -T medical_record_service python manage.py migrate
echo "Migration completed for all services."