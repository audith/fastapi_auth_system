from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
from sqlalchemy.exc import OperationalError

load_dotenv()

# 🔹 Use TEST_DATABASE_URL if set (for CI), else fallback to normal DATABASE_URL
DATABASE_URL = os.getenv("TEST_DATABASE_URL") or f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_HOST')}/{os.getenv('POSTGRES_DB')}"

try:
    engin = create_engine(DATABASE_URL)
    with engin.connect() as conn:
        print(f"✅ Database connected: {DATABASE_URL}")
except OperationalError as exc:
    print("❌ Failed to connect", exc)

SessionLocal = sessionmaker(bind=engin)
Base = declarative_base()