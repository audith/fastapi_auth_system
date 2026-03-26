from fastapi import FastAPI,Depends
from sqlalchemy.orm import Session
from .import product_crud,database,schemas,product_model
from fastapi.security import OAuth2PasswordBearer
from .main import get_current_user
router=FastAPI()
oauth2_scheme=OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token:str= Depends(oauth2_scheme)):
    pass

@router.get("/products")
def list_products(db:Session=Depends(database.get_db)):
    return product_crud.get_products(db)

@router.post("/cart/add/{product_id}")
def add_cart(
    product_id: int,
    quantity: int = 1,
    db: Session = Depends(database.get_db),
    user = Depends(get_current_user)
):
    return product_crud.add_to_cart(db, user.id, product_id, quantity)

@router.get("/cart")
def view_cart(
    db: Session = Depends(database.get_db),
    user = Depends(get_current_user)
):
    return product_crud.get_cart(db, user.id)
