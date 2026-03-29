from pydantic import BaseModel

class UserCreate(BaseModel):
    email:str
    password:str

class UserLogin(BaseModel):
    email:str
    password:str

class ProductCreate(BaseModel):
    name:str
    description:str|None=None
    price:float
    stock:int=0