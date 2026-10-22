import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/services";
import { useAuth } from "../context/AuthContext";
import { useSubmit } from "../hooks/useSubmit";
import Alert from "../components/Alert";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const { submit, loading, error } = useSubmit(async (e) => {
    e.preventDefault();
    const data = await authApi.login(Object.fromEntries(new FormData(e.target)));
    login(data); nav("/inbox");
  });
  return (
    <form className="card" onSubmit={submit}>
      <h2>Welcome back 👋</h2>
      <p className="sub">Login to see what people are saying about you.</p>
      <Alert error={error} />
      <label>Email</label><input name="email" type="email" required />
      <label>Password</label><input name="password" type="password" required />
      <button className="btn" disabled={loading}>{loading ? "..." : "Login"}</button>
      <p className="sub" style={{ marginTop: 14 }}>No account? <Link to="/signup">Sign up</Link></p>
    </form>
  );
}
