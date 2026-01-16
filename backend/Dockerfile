FROM python:3.11

WORKDIR /app

# Copy requirements first to cache dependencies
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create cache directory for models so they persist (optional but good practice)
RUN mkdir -p /app/models_cache
ENV HF_HOME=/app/models_cache

# Copy the rest of the application
COPY . .

# Expose port (Hugging Face Spaces uses 7860 by default)
EXPOSE 7860

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
