# 🍓 Fruit Shop

A full-stack authentication system built with **FastAPI**, **PostgreSQL**, and **React**. The project includes JWT authentication, user registration/login, role-based access, and a simple Fruit Shop application.

---

## Features

* User Registration
* User Login
* JWT Authentication
* Password Hashing
* Admin Account Seeder
* Product Management
* PostgreSQL Database
* React Frontend
* Swagger API Documentation

---

## Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* PostgreSQL
* python-jose (JWT)
* Passlib (bcrypt)
* python-dotenv

### Frontend

* React
* Vite
* JavaScript

---

# Prerequisites

Install the following software before running the project.

| Software   | Download                            |
| ---------- | ----------------------------------- |
| Python 3.x | https://python.org/downloads        |
| Node.js    | https://nodejs.org                  |
| PostgreSQL | https://www.postgresql.org/download |
| Git        | https://git-scm.com/downloads       |

---

# Clone the Repository

```bash
git clone https://github.com/audith/fastapi_auth_system.git

cd fastapi_auth_system
```

---

# Project Structure

```text
fastapi_auth_system/
│
├── backend/
│
├── frontend/
│
├── .env
│
└── README.md
```

---

# Environment Variables

Create a file named **.env** in the project root.

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_DB=fruitshop

SECRET_KEY=supersecretkey123changeme
ALGORITHM=HS256

ADMIN_EMAIL=admin@shop.com
ADMIN_PASSWORD=admin123
```

---

# Database Setup

Open PostgreSQL.

```bash
psql -U postgres -h localhost
```

Create the database.

```sql
CREATE DATABASE fruitshop;
```

Exit.

```sql
\q
```

Connect to the newly created database.

```bash
psql -U postgres -d fruitshop
```

Create the products table.

```sql
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description VARCHAR,
    price FLOAT NOT NULL,
    stock INTEGER DEFAULT 0
);
```

Insert sample data.

```sql
INSERT INTO products (name, description, price, stock) VALUES
('Mango',      'Sweet mango',    2.99, 50),
('Apple',      'Fresh apple',    1.49, 100),
('Banana',     'Ripe banana',    0.99, 75),
('Orange',     'Juicy orange',   1.99, 60),
('Strawberry', 'Fresh berries',  3.49, 40),
('Grape',      'Purple grapes',  2.49, 55),
('Pineapple',  'Tropical fruit', 3.99, 30),
('Watermelon', 'Big watermelon', 4.99, 20),
('Cherry',     'Sweet cherries', 4.49, 35),
('Kiwi',       'Green kiwi',     1.79, 80);
```

Exit PostgreSQL.

```sql
\q
```

---

# Backend Setup

Navigate to the backend directory.

```bash
cd backend
```

Create a virtual environment.

### Windows

```bash
python -m venv .venv

.venv\Scripts\activate
```

### macOS/Linux

```bash
python3 -m venv .venv

source .venv/bin/activate
```

Install dependencies.

```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose "passlib[bcrypt]" python-dotenv python-multipart email-validator
```

---

# Frontend Setup

Open a new terminal.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

---

# Running the Application

The backend and frontend must be running simultaneously.

## Terminal 1 — Backend

```bash
cd backend
```

Activate the virtual environment.

### Windows

```bash
.venv\Scripts\activate
```

### macOS/Linux

```bash
source .venv/bin/activate
```

Start the FastAPI server.

```bash
uvicorn app.main:app --host 127.0.0.1 --port 5000 --reload
```

Expected output:

```text
Database connected
Admin created

Uvicorn running on http://127.0.0.1:5000
```

---

## Terminal 2 — Frontend

```bash
cd frontend

npm run dev
```

Expected output:

```text
VITE ready

Local: http://localhost:5173
```

---

# Access the Application

| Service     | URL                         |
| ----------- | --------------------------- |
| Frontend    | http://localhost:5173       |
| Swagger API | http://127.0.0.1:5000/docs  |
| ReDoc       | http://127.0.0.1:5000/redoc |

---

# Default Admin Account

```
Email:
admin@shop.com

Password:
admin123
```

---

# API Documentation

FastAPI automatically generates interactive API documentation.

* Swagger UI: http://127.0.0.1:5000/docs
* ReDoc: http://127.0.0.1:5000/redoc

---

# Troubleshooting

## PostgreSQL Connection Error

* Verify PostgreSQL is running.
* Confirm the database name is `fruitshop`.
* Check the credentials in the `.env` file.

---

## Module Not Found

Activate the virtual environment before running the backend.

---

## Frontend Dependencies Missing

Run:

```bash
npm install
```

---

## Backend Dependencies Missing

Run:

```bash
pip install -r requirements.txt
```

(if a `requirements.txt` file is available.)

---

# Future Improvements

* Docker Support
* Refresh Tokens
* Email Verification
* Password Reset
* Role-Based Authorization
* Product CRUD
* Shopping Cart
* Order Management
* Payment Integration
* Unit & Integration Tests
* CI/CD Pipeline

---

# License

This project is available for educational and personal use.

---

# Author

**Audith Adhikary**

GitHub: https://github.com/audith
