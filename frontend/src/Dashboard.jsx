import { useEffect, useState } from "react";
import { getUsers, addUser, deleteUser } from "./api";

export default function Dashboard({ setIsAuth }) {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      alert("❌ Not authorized (admin only)");
      logout();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = async () => {
    try {
      await addUser({ email, password });
      setEmail("");
      setPassword("");
      fetchUsers();
    } catch {
      alert("❌ Failed to add user");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch {
      alert("❌ Failed to delete user");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
  };

  return (
    <div>
      <h2>👑 Admin Dashboard</h2>

      <button onClick={logout}>Logout</button>

      <h3>Add User</h3>
      <input
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
      <button onClick={handleAdd}>Add</button>

      <h3>All Users</h3>
      {users.map((u) => (
        <div key={u.id}>
          {u.email} ({u.role})
          <button onClick={() => handleDelete(u.id)}>❌ Delete</button>
        </div>
      ))}
    </div>
  );
}