FROM python:3.12-slim

WORKDIR /app

# Install dependencies in one layer
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    gcc \
    libpq-dev \
    && pip install --no-cache-dir --upgrade pip \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

EXPOSE 8000

# Bind to 0.0.0.0 and use PORT env var (Render provides this)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}