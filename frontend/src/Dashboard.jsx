import { useEffect, useState } from "react";
import { getUsers, addUser, deleteUser, addProduct, deleteProduct, getProducts } from "./api";

const FRUIT_EMOJIS = ["🍎","🍌","🍇","🍓","🍊","🍋","🍍","🥭","🍑","🍒","🥝","🍈"];

export default function Dashboard({ setIsAuth }) {
  const [tab, setTab]           = useState("users");
  const [users, setUsers]       = useState([]);
  const [products, setProducts] = useState([]);

  // user form
  const [uEmail, setUEmail]     = useState("");
  const [uPass, setUPass]       = useState("");

  // product form
  const [pName, setPName]       = useState("");
  const [pDesc, setPDesc]       = useState("");
  const [pPrice, setPPrice]     = useState("");
  const [pStock, setPStock]     = useState("");

  const fetchUsers    = async () => { try { const r = await getUsers();    setUsers(r.data);    } catch { logout(); } };
  const fetchProducts = async () => { try { const r = await getProducts(); setProducts(r.data); } catch {} };

  useEffect(() => { fetchUsers(); fetchProducts(); }, []);

  const handleAddUser = async () => {
    if (!uEmail || !uPass) return alert("Fill all fields");
    try { await addUser({ email: uEmail, password: uPass }); setUEmail(""); setUPass(""); fetchUsers(); }
    catch { alert("❌ Failed to add user"); }
  };

  const handleDeleteUser = async (id) => {
    try { await deleteUser(id); fetchUsers(); }
    catch { alert("❌ Failed to delete user"); }
  };

  const handleAddProduct = async () => {
    if (!pName || !pPrice) return alert("Name and price required");
    try {
      await addProduct({ name: pName, description: pDesc, price: parseFloat(pPrice), stock: parseInt(pStock) || 0 });
      setPName(""); setPDesc(""); setPPrice(""); setPStock("");
      fetchProducts();
    } catch { alert("❌ Failed to add product"); }
  };

  const handleDeleteProduct = async (id) => {
    try { await deleteProduct(id); fetchProducts(); }
    catch { alert("❌ Failed to delete product"); }
  };

  const logout = () => { localStorage.removeItem("token"); window.location.reload(); };

  const getEmoji = (name) => {
    const map = { apple:"🍎", banana:"🍌", grape:"🍇", strawberry:"🍓", orange:"🍊",
      lemon:"🍋", pineapple:"🍍", mango:"🥭", peach:"🍑", cherry:"🍒", kiwi:"🥝", melon:"🍈" };
    return map[name.toLowerCase()] || "🍉";
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h2>👑 Admin Dashboard</h2>
        <button className="btn-red" onClick={logout}>Logout</button>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === "users"    ? "active" : ""}`} onClick={() => setTab("users")}>👥 Users</button>
        <button className={`tab ${tab === "products" ? "active" : ""}`} onClick={() => setTab("products")}>🍎 Fruits</button>
      </div>

      {/* USERS TAB */}
      {tab === "users" && (
        <div>
          <h3>Add User</h3>
          <input placeholder="Email"    value={uEmail} onChange={(e) => setUEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={uPass}  onChange={(e) => setUPass(e.target.value)} />
          <button onClick={handleAddUser}>➕ Add User</button>

          <h3>All Users ({users.length})</h3>
          {users.length === 0 && <p className="empty">No users yet</p>}
          {users.map((u) => (
            <div className="user-item" key={u.id}>
              <span>{u.email}<span className={`badge ${u.role === "admin" ? "admin" : ""}`}>{u.role}</span></span>
              <button className="btn-red" onClick={() => handleDeleteUser(u.id)}>❌</button>
            </div>
          ))}
        </div>
      )}

      {/* PRODUCTS TAB */}
      {tab === "products" && (
        <div>
          <h3>Add Fruit</h3>
          <input placeholder="Fruit name (e.g. Mango)" value={pName}  onChange={(e) => setPName(e.target.value)} />
          <input placeholder="Description (optional)"  value={pDesc}  onChange={(e) => setPDesc(e.target.value)} />
          <input placeholder="Price (e.g. 1.99)" type="number" value={pPrice} onChange={(e) => setPPrice(e.target.value)} />
          <input placeholder="Stock quantity"    type="number" value={pStock} onChange={(e) => setPStock(e.target.value)} />
          <button onClick={handleAddProduct}>➕ Add Fruit</button>

          <h3>All Fruits ({products.length})</h3>
          {products.length === 0 && <p className="empty">No fruits added yet</p>}
          <div className="fruit-grid">
            {products.map((p) => (
              <div className="fruit-card" key={p.id}>
                <div className="emoji">{getEmoji(p.name)}</div>
                <div className="name">{p.name}</div>
                <div className="price">${p.price.toFixed(2)}</div>
                <div style={{ fontSize:11, color:"#888", marginBottom:6 }}>Stock: {p.stock}</div>
                <button className="btn-red" onClick={() => handleDeleteProduct(p.id)}>❌ Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}