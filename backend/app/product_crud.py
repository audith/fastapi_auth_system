from sqlalchemy.orm import Session
from .product_model import Product, CartItem




def get_products(db: Session):
    return (
        db.query(Product)
        .order_by(Product.id)
        .all()
    )




def add_to_cart(
    db: Session,
    user_id: int,
    product_id: int,
    quantity: int = 1
):
    if quantity <= 0:
        raise ValueError(
            "Quantity must be greater than 0"
        )

    # Lock product row
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .with_for_update()
        .first()
    )

    if not product:
        raise ValueError(
            "Product not found"
        )

    # Stock check
    if product.stock < quantity:
        raise ValueError(
            f"Only {product.stock} items available"
        )

    # Existing cart item?
    item = (
        db.query(CartItem)
        .filter(
            CartItem.user_id == user_id,
            CartItem.product_id == product_id
        )
        .first()
    )

    if item:
        item.quantity += quantity
    else:
        item = CartItem(
            user_id=user_id,
            product_id=product_id,
            quantity=quantity
        )
        db.add(item)

    # Reduce stock
    product.stock -= quantity

    db.commit()

    db.refresh(item)
    db.refresh(product)

    return item


# =========================
# GET USER CART
# =========================

def get_cart(
    db: Session,
    user_id: int
):
    return (
        db.query(CartItem)
        .filter(
            CartItem.user_id == user_id
        )
        .order_by(CartItem.product_id)
        .all()
    )


# =========================
# REMOVE FROM CART
# =========================

def remove_from_cart(
    db: Session,
    user_id: int,
    product_id: int
):
    item = (
        db.query(CartItem)
        .filter(
            CartItem.user_id == user_id,
            CartItem.product_id == product_id
        )
        .first()
    )

    if not item:
        return False

    # Lock product row
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .with_for_update()
        .first()
    )

    if product:
        product.stock += item.quantity

    db.delete(item)

    db.commit()

    return True