# Use the official Python image from the Docker Hub
FROM python:3.10.2-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    pkg-config \
    default-libmysqlclient-dev \
    ffmpeg \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install pipenv
RUN pip install --no-cache-dir pipenv

# Copy the Pipfile and Pipfile.lock into the container
COPY Pipfile Pipfile.lock /app/

# # Update Pipfile.lock
# RUN pipenv lock

# Install dependencies using pipenv
RUN pipenv install --deploy --ignore-pipfile

# Copy the rest of the application code into the container
COPY ./app/ /app/

# Expose port 8000 for the FastAPI app
EXPOSE 8000

# Run the FastAPI application using uvicorn
CMD ["pipenv", "run", "python", "main.py"]
