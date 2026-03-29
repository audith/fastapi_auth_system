import { useEffect, useState } from "react";
import { getProducts, getCart, addToCart, removeFromCart } from "./api";

const FRUIT_IMAGES = {
  apple:      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200&q=80",
  banana:     "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&q=80",
  grape:      "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=200&q=80",
  strawberry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&q=80",
  orange:     "https://images.unsplash.com/photo-1547514701-42782101795e?w=200&q=80",
  lemon:      "https://images.unsplash.com/photo-1582287014914-1db0724c67a0?w=200&q=80",
  pineapple:  "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200&q=80",
  mango:      "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=200&q=80",
  peach:      "https://images.unsplash.com/photo-1595743825637-cdafc8ad4173?w=200&q=80",
  cherry:     "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=200&q=80",
  kiwi:       "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=200&q=80",
  watermelon: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=200&q=80",
  default:    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&q=80",
};

const FRUIT_EMOJIS = {
  apple:"🍎", banana:"🍌", grape:"🍇", strawberry:"🍓", orange:"🍊",
  lemon:"🍋", pineapple:"🍍", mango:"🥭", peach:"🍑", cherry:"🍒",
  kiwi:"🥝", watermelon:"🍉",
};

export default function UserHome({ setIsAuth }) {
  const [tab, setTab]           = useState("shop");
  const [products, setProducts] = useState([]);
  const [cart, setCart]         = useState([]);
  const [loading, setLoading]   = useState(null);
  const [error, setError]       = useState("");      // 👈 show errors

  const fetchProducts = async () => {
    try {
      const r = await getProducts();
      setProducts(r.data);
      setError("");
    } catch (err) {
      // 👇 now you can SEE what is going wrong
      const msg = err.response?.data?.detail || err.message || "Failed to load fruits";
      setError(`❌ ${msg}`);
      console.error("fetchProducts error:", err.response?.data || err);
    }
  };

  const fetchCart = async () => {
    try {
      const r = await getCart();
      setCart(r.data);
    } catch (err) {
      console.error("fetchCart error:", err.response?.data || err);
    }
  };

  useEffect(() => { fetchProducts(); fetchCart(); }, []);

  const getImage = (name) => FRUIT_IMAGES[name?.toLowerCase()] || FRUIT_IMAGES.default;
  const getEmoji = (name) => FRUIT_EMOJIS[name?.toLowerCase()] || "🍉";

  const handleAddToCart = async (productId) => {
    setLoading(productId);
    try {
      await addToCart(productId, 1);
      await fetchCart();
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to add to cart";
      alert(`❌ ${msg}`);
    }
    setLoading(null);
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      fetchCart();
    } catch {
      alert("❌ Failed to remove");
    }
  };

  const logout = () => { localStorage.removeItem("token"); window.location.reload(); };

  const isInCart  = (id) => cart.some((c) => c.product_id === id);
  const cartTotal = cart.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h2>🍓 Fruit Shop</h2>
        <button className="btn-red" onClick={logout}>Logout</button>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === "shop" ? "active" : ""}`} onClick={() => setTab("shop")}>
          🛒 Shop
        </button>
        <button className={`tab ${tab === "cart" ? "active" : ""}`} onClick={() => setTab("cart")}>
          🧺 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>

      {/* ✅ Show error clearly */}
      {error && (
        <div style={{ background:"#fce4ec", color:"#c62828", padding:"10px 14px",
          borderRadius:10, marginBottom:12, fontSize:13 }}>
          {error}
        </div>
      )}

      {/* SHOP */}
      {tab === "shop" && (
        <div>
          {!error && products.length === 0 && (
            <p className="empty">No fruits added yet — ask admin to add some 🌱</p>
          )}
          <div className="fruit-grid">
            {products.map((p) => (
              <div className="fruit-card" key={p.id}>
                <div className="fruit-img-wrap">
                  <img
                    src={getImage(p.name)}
                    alt={p.name}
                    className="fruit-img"
                    onError={(e) => { e.target.src = FRUIT_IMAGES.default; }}
                  />
                </div>
                <div className="name">{getEmoji(p.name)} {p.name}</div>
                <div className="price">${p.price.toFixed(2)}</div>
                <div className="stock">Stock: {p.stock}</div>
                {isInCart(p.id)
                  ? <button className="btn-outline" disabled>✅ In Cart</button>
                  : <button onClick={() => handleAddToCart(p.id)} disabled={loading === p.id}>
                      {loading === p.id ? "Adding..." : "🛒 Add to Cart"}
                    </button>
                }
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CART */}
      {tab === "cart" && (
        <div>
          {cart.length === 0 && <p className="empty">Your cart is empty 🛒</p>}
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img
                src={getImage(item.product?.name)}
                alt={item.product?.name}
                className="cart-thumb"
                onError={(e) => { e.target.src = FRUIT_IMAGES.default; }}
              />
              <div className="cart-info">
                <div className="cart-name">{getEmoji(item.product?.name)} {item.product?.name}</div>
                <div className="cart-qty">Qty: {item.quantity}</div>
              </div>
              <div className="cart-right">
                <div className="cart-price">${((item.product?.price || 0) * item.quantity).toFixed(2)}</div>
                <button className="btn-red" onClick={() => handleRemove(item.product_id)}>❌</button>
              </div>
            </div>
          ))}
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