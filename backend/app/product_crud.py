from sqlalchemy.orm import Session
from .product_model import Product, CartItem

def get_products(db: Session) -> list[Product]:
    return db.query(Product).all()

def add_to_cart(db: Session, user_id: int, product_id: int, quantity: int = 1) -> CartItem:
    item = db.query(CartItem).filter_by(user_id=user_id, product_id=product_id).first()
    if item:
        item.quantity += quantity
    else:
        item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.add(item)
    db.commit()
    db.refresh(item)
    return item

def get_cart(db: Session, user_id: int) -> list[CartItem]:
    return db.query(CartItem).filter_by(user_id=user_id).all()