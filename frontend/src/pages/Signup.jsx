import { useNavigate } from "react-router-dom";
import { authApi } from "../api/services";
import { useSubmit } from "../hooks/useSubmit";
import Alert from "../components/Alert";

export default function Signup() {
  const nav = useNavigate();
  const { submit, loading, error } = useSubmit(async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    await authApi.signup(d);
    nav(`/confirm?email=${encodeURIComponent(d.email)}`);
  });
  return (
    <form className="card" onSubmit={submit}>
      <h2>Create your account</h2>
      <p className="sub">Get your link, share it, receive anonymous messages.</p>
      <Alert error={error} />
      <label>Full name (first last)</label><input name="username" required minLength={2} placeholder="Ahmed Ali" />
      <label>Email</label><input name="email" type="email" required />
      <label>Phone (E.164)</label><input name="phone" required placeholder="+201001234567" />
      <label>Password</label><input name="password" type="password" required placeholder="8-16 chars, Aa, 1, !@#$%^&*_" />
      <label>Confirm password</label><input name="confirmPassword" type="password" required />
      <button className="btn" disabled={loading}>{loading ? "..." : "Sign up"}</button>
    </form>
  );
}
