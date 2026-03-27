from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .database import get_db
from .dependencies import get_current_user
from .models import User
from . import product_crud

router = APIRouter(tags=["Products"])

@router.get("/products")
def list_products(db: Session = Depends(get_db)):
    return product_crud.get_products(db)

@router.post("/cart/add/{product_id}")
def add_to_cart(
    product_id: int,
    quantity: int = 1,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return product_crud.add_to_cart(db, user.id, product_id, quantity)

@router.get("/cart")
def view_cart(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return product_crud.get_cart(db, user.id)