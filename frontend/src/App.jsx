import "./App.css";
import { useState } from "react";
import Auth from "./Auth";
import Dashboard from "./Dashboard";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="container">
      <div className="card">
        {!isAuth && (
          <Auth setIsAuth={setIsAuth} setIsAdmin={setIsAdmin} />
        )}

        {isAuth && isAdmin && (
          <Dashboard setIsAuth={setIsAuth} />
        )}

        {isAuth && !isAdmin && (
          <p>🎉 You are logged in as a user!</p>
        )}
      </div>
    </div>
  );
}

export default App;