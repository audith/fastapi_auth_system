from sqlalchemy.orm import Session
from .import product_model

def get_products(db:Session):
    return db.query(product_model.Product).all()


def add_to_cart(db:Session,user_id:int,product_id:int,quantity:int=1):
    item=db.query(product_model.CartItem).filter_by(user_id=user_id,product_id=product_id).first()
    if item:
        item.quantity+=quantity
    else:
        item=product_model.CartItem(user_id=user_id,product_id=product_id,quantity=quantity)
        db.add(item)
    db.commit()
    db.refresh(item)
    return item

def get_cart(db:Session,user_id:int):
    return db.query(product_model.CartItem).filter_by(user_id=user_id).all()
    