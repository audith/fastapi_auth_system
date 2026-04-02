import { useEffect, useState } from "react";
import { getUsers, addUser, deleteUser } from "./api";

export default function Dashboard({ setIsAuth }) {
  const [users,    setUsers]    = useState([]);
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);

  const fetchUsers = async () => {
    try {
      const r = await getUsers();
      setUsers(r.data);
    } catch {
      alert("❌ Not authorized");
      logout();
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async () => {
    if (!email || !password) return alert("Fill all fields");
    setLoading(true);
    try {
      await addUser({ email, password });
      setEmail("");
      setPassword("");
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to add user";
      alert(`❌ ${msg}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch {
      alert("❌ Failed to delete user");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2>👑 Admin Dashboard</h2>
        <button className="btn-red" onClick={logout}>Logout</button>
      </div>

      {/* Add User */}
      <h3>➕ Add New User</h3>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAdd} disabled={loading}>
        {loading ? "Adding..." : "Add User"}
      </button>

      {/* Users List */}
      <h3>👥 All Users ({users.length})</h3>
      {users.length === 0 && <p className="empty">No users found</p>}
      {users.map((u) => (
        <div className="user-item" key={u.id}>
          <span>
            {u.email}
            <span className={`badge ${u.role === "admin" ? "admin" : ""}`}>
              {u.role}
            </span>
          </span>
          {u.role !== "admin" && (
            <button className="btn-red" onClick={() => handleDelete(u.id)}>
              ❌ Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}