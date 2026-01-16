FROM python:3.11

WORKDIR /app

# Copy requirements first to cache dependencies
COPY requirements.txt .

# Install dependencies (ensure --no-cache-dir to save space if needed, but here we have plenty)
RUN pip install --no-cache-dir -r requirements.txt

# Create cache directory for models so they persist
RUN mkdir -p /app/models_cache
ENV HF_HOME=/app/models_cache

# Copy the rest of the application
COPY . .

# Expose port (Hugging Face Spaces uses 7860 by default)
EXPOSE 7860

# Command to run the application
# Important: Hugging Face runs as user 1000, so we need to ensure permissions if we wrote files
# But for now, simple startup is fine.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
