#!/bin/sh
echo "Waiting for postgres..."

while ! nc -z auth_postgres 5432; do
  sleep 1
done

echo "PostgreSQL started"

# Run migrations and then start server
python manage.py migrate
exec "$@"