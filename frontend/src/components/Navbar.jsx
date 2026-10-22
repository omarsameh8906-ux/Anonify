import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuth, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header>
      <Link className="logo" to="/">Annonify</Link>
      <nav>
        {isAuth ? (
          <>
            <Link to="/inbox">Inbox</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={async () => { await logout(); nav("/login"); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
