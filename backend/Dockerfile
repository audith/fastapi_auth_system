# -------- Stage 1: Build React frontend --------
FROM node:20 AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# -------- Stage 2: Backend + serve frontend --------
FROM python:3.11
WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Copy built frontend into backend static folder
COPY --from=frontend-build /app/dist ./app/static  

# Expose backend port
EXPOSE 5000

# Run FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]