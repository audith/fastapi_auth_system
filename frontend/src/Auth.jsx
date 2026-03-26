import { useState } from "react";
import { login, register } from "./api";

export default function Auth({ setIsAuth, setIsAdmin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      if (isRegister) {
        await register({ email, password });
        alert("✅ Registered! Now login.");
        setIsRegister(false);
      } else {
        const res = await login({ email, password });

        if (res.data && res.data.access_token) {
          const token = res.data.access_token;

          // 🔥 Save token
          localStorage.setItem("token", token);

          // 🔥 Decode token to get role
          const payload = JSON.parse(atob(token.split(".")[1]));

          // 🔥 Check role
          if (payload.role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }

          setIsAuth(true);
          alert("✅ Login successful");
        } else {
          alert("⚠️ Login failed: no token returned");
        }
      }
    } catch (err) {
      console.error("FULL ERROR:", err);

      if (err.response && err.response.data) {
        console.error("BACKEND ERROR:", err.response.data);

        if (typeof err.response.data === "string") {
          alert(err.response.data);
        } else if (err.response.data.detail) {
          alert(err.response.data.detail);
        } else {
          alert(JSON.stringify(err.response.data));
        }
      } else {
        alert("⚠️ Server not reachable");
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>{isRegister ? "Register" : "Login"}</h2>

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

      <button onClick={submit} disabled={loading}>
        {loading
          ? isRegister
            ? "Registering..."
            : "Logging in..."
          : isRegister
          ? "Register"
          : "Login"}
      </button>

      <p
        onClick={() => setIsRegister(!isRegister)}
        style={{ cursor: "pointer", marginTop: "10px" }}
      >
        {isRegister
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </p>
    </div>
  );
}