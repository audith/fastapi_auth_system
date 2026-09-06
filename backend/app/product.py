from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .database import get_db
from .dependencies import get_current_user
from .models import User
from . import product_crud


router = APIRouter(tags=["Products"])


@router.get("/products")
def list_products(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return product_crud.get_products(db)


@router.post("/cart/add/{product_id}")
def add_to_cart(
    product_id: int,
    quantity: int = 1,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):

    try:
        item = product_crud.add_to_cart(
            db=db,
            user_id=user.id,
            product_id=product_id,
            quantity=quantity
        )

        return {
            "message": "Product added to cart",
            "cart_item": {
                "id": item.id,
                "user_id": item.user_id,
                "product_id": item.product_id,
                "quantity": item.quantity
            }
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get("/cart")
def view_cart(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):

    return product_crud.get_cart(db, user.id)


@router.delete("/cart/remove/{product_id}")
def remove_from_cart(
    product_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):

    success = product_crud.remove_from_cart(
        db=db,
        user_id=user.id,
        product_id=product_id
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Item not in cart"
        )

    return {
        "message": "Product removed from cart"
    }