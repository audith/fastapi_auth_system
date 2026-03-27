import os
import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .database import engine, Base, get_db, SessionLocal
from .schemas import UserCreate, UserLogin
from .crud import create_user, get_user, get_all_users, delete_user
from .auth import verify_password, create_token
from .dependencies import get_current_user, get_admin_user
from .product import router as product_router

app = FastAPI()

# ----------- STARTUP: CREATE ADMIN -----------
@app.on_event("startup")
def create_admin():
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    if not admin_email or not admin_password:
        print("⚠️ ADMIN_EMAIL or ADMIN_PASSWORD not set, skipping admin creation")
        return
    db = SessionLocal()
    try:
        if not get_user(db, admin_email):
            create_user(db, admin_email, admin_password, role="admin")
            print("✅ Admin created")
    finally:
        db.close()

# ----------- DATABASE -----------
Base.metadata.create_all(bind=engine)

# ----------- CORS -----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------- ROUTERS -----------
app.include_router(product_router)

# ----------- AUTH ROUTES -----------
@app.post("/register", tags=["Auth"])
def register(user: UserCreate, db: Session = Depends(get_db)):
    if get_user(db, user.email):
        raise HTTPException(status_code=400, detail="User already exists")
    return create_user(db, user.email, user.password)

@app.post("/login", tags=["Auth"])
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = get_user(db, user.email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Wrong password")
    token = create_token({"sub": db_user.email, "role": db_user.role})
    return {"access_token": token, "token_type": "bearer"}

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
    deleted = delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}

# ----------- RUN -----------
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=5000, reload=True)