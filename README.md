# fastapi_auth_system

https://python.org/downloads

https://nodejs.org

https://www.postgresql.org/download

git clone https://github.com/audith/fastapi_auth_system.git
cd fastapi_auth_system

fastapi_auth_system/
└── .env   ← create here
 #paste this inside
 POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_DB=fruitshop

SECRET_KEY=supersecretkey123changeme
ALGORITHM=HS256

ADMIN_EMAIL=admin@shop.com
ADMIN_PASSWORD=admin123

#create the database
psql -U postgres -h localhost
CREATE DATABASE fruitshop;
\q

#paste this inside
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description VARCHAR,
  price FLOAT NOT NULL,
  stock INTEGER DEFAULT 0
);

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

\q

#Set up Python backend
cd backend
Create virtual environment:
python -m venv .venv
.venv\Scripts\activate

Install packages:
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose "passlib[bcrypt]" python-dotenv python-multipart email-validator

 Set up React frontend
Open a new terminal, go back to root folder:
cd fastapi_auth_system/frontend
npm install

▶️ Running the Project
You need 2 terminals open at the same time.

Terminal 1 — Start backend:
cd fastapi_auth_system/backend

# activate venv first
source .venv/bin/activate        # Mac/Linux
.venv\Scripts\activate           # Windows

# start server
uvicorn app.main:app --host 127.0.0.1 --port 5000 --reload

You should see:
✅ Database connected
✅ Admin created
INFO:     Uvicorn running on http://127.0.0.1:5000


Terminal 2 — Start frontend:

cd fastapi_auth_system/frontend
npm run dev

VITE v5.x.x  ready

  ➜  Local:   http://localhost:5173/

🌐 Open in browser
WhatURL🍓 Fruit Shop apphttp://localhost:5173
📄 API docs (Swagger)http://127.0.0.1:5000/docs


