import { useEffect, useState } from "react";
import { getCart, addToCart, removeFromCart } from "./api";

const FRUITS = [
  { id:1,  name:"Mango",      price:2.99, stock:50,  image:"https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=200&q=80" },
  { id:2,  name:"Apple",      price:1.49, stock:100, image:"https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200&q=80" },
  { id:3,  name:"Banana",     price:0.99, stock:75,  image:"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&q=80" },
  { id:4,  name:"Orange",     price:1.99, stock:60,  image:"https://images.unsplash.com/photo-1547514701-42782101795e?w=200&q=80" },
  { id:5,  name:"Strawberry", price:3.49, stock:40,  image:"https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&q=80" },
  { id:6,  name:"Grape",      price:2.49, stock:55,  image:"https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=200&q=80" },
  { id:7,  name:"Pineapple",  price:3.99, stock:30,  image:"https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200&q=80" },
  { id:8,  name:"Watermelon", price:4.99, stock:20,  image:"https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=200&q=80" },
  { id:9,  name:"Cherry",     price:4.49, stock:35,  image:"https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=200&q=80" },
  { id:10, name:"Kiwi",       price:1.79, stock:80,  image:"https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=200&q=80" },
];

const EMOJIS = {
  mango:"🥭", apple:"🍎", banana:"🍌", orange:"🍊",
  strawberry:"🍓", grape:"🍇", pineapple:"🍍",
  watermelon:"🍉", cherry:"🍒", kiwi:"🥝",
};

const DEFAULT_IMG = "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&q=80";

export default function UserHome({ setIsAuth }) {
  const [tab,     setTab]     = useState("shop");
  const [cart,    setCart]    = useState([]);
  const [loading, setLoading] = useState(null);

  const fetchCart = async () => {
    try {
      const r = await getCart();
      setCart(r.data);
    } catch (err) {
      console.error("Cart error:", err.response?.data || err);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const emoji     = (name) => EMOJIS[name?.toLowerCase()] || "🍉";
  const isInCart  = (id)   => cart.some((c) => c.product_id === id);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => {
    const f = FRUITS.find((f) => f.id === i.product_id);
    return s + (f?.price || 0) * i.quantity;
  }, 0);

  const handleAdd = async (id) => {
    setLoading(id);
    try {
      await addToCart(id, 1);
      await fetchCart();
    } catch (err) {
      alert(`❌ ${err.response?.data?.detail || "Failed to add"}`);
    }
    setLoading(null);
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      await fetchCart();
    } catch {
      alert("❌ Failed to remove");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h2>🍓 Fruit Shop</h2>
        <button className="btn-red" onClick={logout}>Logout</button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab==="shop"?"active":""}`} onClick={() => setTab("shop")}>
          🛒 Shop
        </button>
        <button className={`tab ${tab==="cart"?"active":""}`} onClick={() => setTab("cart")}>
          🧺 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>

      {/* SHOP */}
      {tab === "shop" && (
        <div className="fruit-grid">
          {FRUITS.map((p) => (
            <div className="fruit-card" key={p.id}>
              <div className="fruit-img-wrap">
                <img src={p.image} alt={p.name} className="fruit-img"
                  onError={(e) => { e.target.src = DEFAULT_IMG; }} />
              </div>
              <div className="name">{emoji(p.name)} {p.name}</div>
              <div className="price">${p.price.toFixed(2)}</div>
              <div className="stock">Stock: {p.stock}</div>
              {isInCart(p.id)
                ? <button className="btn-outline" disabled>✅ In Cart</button>
                : <button onClick={() => handleAdd(p.id)} disabled={loading === p.id}>
                    {loading === p.id ? "Adding..." : "🛒 Add"}
                  </button>
              }
            </div>
          ))}
        </div>
      )}

      {/* CART */}
      {tab === "cart" && (
        <div>
          {cart.length === 0 && <p className="empty">Your cart is empty 🛒</p>}
          {cart.map((item) => {
            const f = FRUITS.find((f) => f.id === item.product_id);
            return (
              <div className="cart-item" key={item.id}>
                <img src={f?.image} alt={f?.name} className="cart-thumb"
                  onError={(e) => { e.target.src = DEFAULT_IMG; }} />
                <div className="cart-info">
                  <div className="cart-name">{emoji(f?.name)} {f?.name}</div>
                  <div className="cart-qty">Qty: {item.quantity}</div>
                </div>
                <div className="cart-right">
                  <div className="cart-price">${((f?.price||0)*item.quantity).toFixed(2)}</div>
                  <button className="btn-red" onClick={() => handleRemove(item.product_id)}>❌</button>
                </div>
              </div>
            );
          })}
          {cart.length > 0 && (
            <div className="cart-total">
              <span>Total</span>
              <span className="total-price">${cartTotal.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}