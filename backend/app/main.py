from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import uvicorn
import os

from .database import SessionLocal, engin, Base
from .schemas import UserCreate, UserLogin
from .crud import create_user, get_user, get_all_users, delete_user
from .auth import verify_password, create_token, SECRET_KEY, ALGORITHM
from .models import User

app = FastAPI()

# ----------- STARTUP: CREATE ADMIN -----------
@app.on_event("startup")
def create_admin():
    db = SessionLocal()
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    existing = get_user(db, admin_email)
    if not existing:
        create_user(db, admin_email, admin_password, role="admin")
        print("✅ Admin created")
    db.close()

# ----------- CORS -----------
origins = ["http://localhost:3000", "http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------- DATABASE -----------
Base.metadata.create_all(bind=engin)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------- AUTH -----------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login-form")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        if email is None or role is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = get_user(db, email)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# ----------- ROUTES -----------

# REGISTER
@app.post("/register", tags=["Auth"])
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = get_user(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    return create_user(db, user.email, user.password)

# LOGIN JSON (for frontend)
@app.post("/login", tags=["Auth"])
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = get_user(db, user.email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Wrong password")
    token = create_token({"sub": db_user.email, "role": db_user.role})
    return {"access_token": token, "token_type": "bearer"}

# LOGIN FORM (for Swagger UI)
@app.post("/login-form", tags=["Auth"])
def login_form(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = get_user(db, form_data.username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(form_data.password, db_user.password):
        raise HTTPException(status_code=401, detail="Wrong password")
    token = create_token({"sub": db_user.email, "role": db_user.role})
    return {"access_token": token, "token_type": "bearer"}

# ----------- ADMIN ROUTES -----------
@app.get("/admin/users", tags=["Admin"], dependencies=[Depends(get_admin_user)])
def admin_get_users(db: Session = Depends(get_db)):
    return get_all_users(db)

@app.post("/admin/add-user", tags=["Admin"], dependencies=[Depends(get_admin_user)])
def admin_add_user(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user.email, user.password)

@app.delete("/admin/delete-user/{user_id}", tags=["Admin"], dependencies=[Depends(get_admin_user)])
def admin_delete_user(user_id: int, db: Session = Depends(get_db)):
    deleted_user = delete_user(db, user_id)
    if not deleted_user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}

# ----------- RUN SERVER -----------
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=5000, reload=True)