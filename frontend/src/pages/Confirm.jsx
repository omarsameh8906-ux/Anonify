import { useSearchParams, useNavigate } from "react-router-dom";
import { authApi } from "../api/services";
import { useSubmit } from "../hooks/useSubmit";
import Alert from "../components/Alert";

export default function Confirm() {
  const [q] = useSearchParams();
  const nav = useNavigate();
  const { submit, loading, error, success, setError, setSuccess } = useSubmit(async (e) => {
    e.preventDefault();
    await authApi.confirmEmail(Object.fromEntries(new FormData(e.target)));
    nav("/login");
  });
  const resend = async (e) => {
    e.preventDefault();
    try { await authApi.resendConfirm(e.target.closest("form").email.value); setError(""); setSuccess("Code sent ✔"); }
    catch (err) { setSuccess(""); setError(err.message); }
  };
  return (
    <form className="card" onSubmit={submit}>
      <h2>Confirm your email 📩</h2>
      <p className="sub">We sent a 6-digit code to the email below.</p>
      <Alert error={error} success={success} />
      <label>Email</label><input name="email" type="email" required defaultValue={q.get("email") || ""} />
      <label>Code</label><input name="otp" required inputMode="numeric" maxLength={6} placeholder="123456" />
      <button className="btn" disabled={loading}>{loading ? "..." : "Confirm"}</button>
      <p className="sub" style={{ marginTop: 14 }}><a href="#" onClick={resend}>Resend code</a></p>
    </form>
  );
}
