import "./App.css";
import { useState } from "react";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import UserHome from "./UserHome";

function App() {
  const [isAuth, setIsAuth]   = useState(false);
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
          <UserHome setIsAuth={setIsAuth} />
        )}
      </div>
    </div>
  );
}

export default App;