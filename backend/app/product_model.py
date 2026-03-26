from sqlalchemy import Column,String,Float,ForeignKey,Integer
from sqlalchemy.orm import relationship
from .database import Base


class Product(Base):
    __tablename__="products"

    id=Column(Integer,primary_key=True,index=True)
    name=Column(String,nullable=False)
    description=Column(String)
    price=Column(Float,nullable=False)
    stock=Column(Integer,default=0)


class CartItem(Base):
    __tablename__="cart_item"

    id=Column(Integer,primary_key=True,index=True)
    user_id=Column(Integer,ForeignKey("users.id"))
    product_id=Column(Integer,ForeignKey("products.id"))
    quantity=Column(Integer,default=1)

    product=relationship("Product")

