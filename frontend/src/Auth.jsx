import { useState } from "react";
import { login, register } from "./api";

export default function Auth({ setIsAuth, setIsAdmin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [loading, setLoading]       = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      if (isRegister) {
        await register({ email, password });
        alert("✅ Registered! Now login.");
        setIsRegister(false);
      } else {
        const res = await login({ email, password });
        if (res.data?.access_token) {
          const token = res.data.access_token;
          localStorage.setItem("token", token);
          const payload = JSON.parse(atob(token.split(".")[1]));
          setIsAdmin(payload.role === "admin");
          setIsAuth(true);
        } else {
          alert("⚠️ Login failed: no token returned");
        }
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "⚠️ Server not reachable";
      alert(msg);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>{isRegister ? "🍓 Register" : "🍓 Fruit Shop Login"}</h2>
      <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)} />
      <button onClick={submit} disabled={loading}>
        {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
      </button>
      <p className="link-text" onClick={() => setIsRegister(!isRegister)}>
        {isRegister
          ? <>Already have an account? <span>Login</span></>
          : <>Don't have an account? <span>Register</span></>}
      </p>
    </div>
  );
}