# =====================================================
# OTRAS ML Service Dockerfile
# Production Ready
# =====================================================

# ---------- Base Image ----------
FROM python:3.11-slim

# ---------- Environment Variables ----------
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# ---------- Working Directory ----------
WORKDIR /app

# ---------- Install System Dependencies ----------
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# ---------- Copy Requirements ----------
COPY requirements.txt .

# ---------- Install Python Dependencies ----------
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ---------- Copy Application Code ----------
COPY src/ ./src/
COPY models/ ./models/

# NOTE:
# We intentionally DO NOT copy notebooks/
# Notebooks are development-only artifacts.

# ---------- Expose Port ----------
EXPOSE 5000

# ---------- Healthcheck (Optional but Recommended) ----------
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost:5000/health || exit 1

# ---------- Run FastAPI ----------
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "5000"]
