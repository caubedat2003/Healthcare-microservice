FROM python:3.10-slim

WORKDIR /app

# system deps for building some numpy/scipy/sklearn wheels if needed
RUN apt-get update && apt-get install -y build-essential gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy app code and data
COPY . .

EXPOSE 5000

# Use the module directly. For production you can replace with gunicorn.
CMD ["python", "chatbot_api.py"]