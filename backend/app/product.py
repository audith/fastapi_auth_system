from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session

from .database import get_db
from .dependencies import get_admin_user,get_current_user
from .models import User
from . import product_crud
from .schemas import ProductCreate

router = APIRouter(tags=["Products"])

@router.post("/admin/products")
def add_product(
    data:ProductCreate,
    db:Session=Depends(get_db),
    admin:User=Depends(get_admin_user),
):
    return product_crud.create_product(db,data)
@router.delete("/admin/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    deleted = product_crud.delete_product(db, product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}

@router.get("/products")
def list_products(
    db:Session=Depends(get_db),
    user:User=Depends(get_current_user),
):
    return product_crud.get_products(db)
@router.post("/cart/add/{product_id}")
def add_to_cart(
    product_id: int,
    quantity: int = 1,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user), 
):
    item = product_crud.add_to_cart(db, user.id, product_id, quantity)
    if not item:
        raise HTTPException(status_code=404, detail="Product not found")
    return item

@router.get("/cart")
def view_cart(
    db:Session=Depends(get_db),
    user:User=Depends(get_current_user)
):
    return product_crud.get_cart(db,user.id)

@router.delete("/cart/remove/{product_id}")
def  remove_from_cart(
    product_id:int,
    db:Session=Depends(get_db),
    user:User=Depends(get_current_user),
):
    success=product_crud.remove_from_cart(db,user.id,product_id)
    if not success:
        raise HTTPException(status_code=404 ,detail="item is not in cart")
    return {"message":"Removed from cart"}