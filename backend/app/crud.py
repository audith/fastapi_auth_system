from sqlalchemy.orm import Session
from .models import User
from .auth import hash_password

def create_user(db: Session, email: str, password: str, role: str = "user") -> User:
    user = User(email=email, password=hash_password(password), role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()

def get_all_users(db: Session) -> list[User]:
    return db.query(User).all()

def delete_user(db: Session, user_id: int) -> User | None:
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    db.delete(user)
    db.commit()
    return user