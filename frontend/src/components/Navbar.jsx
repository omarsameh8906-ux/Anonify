
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuth, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) return;

    await logout();
    nav("/login");
  };

  return (
    <header>
      <Link className="logo" to="/">Anonify</Link>

      <nav>
        {isAuth ? (
          <>
            <Link to="/inbox">Inbox</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
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
