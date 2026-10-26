
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/services";
import { useSubmit } from "../hooks/useSubmit";
import Alert from "../components/Alert";

export default function Signup() {
  const nav = useNavigate();

  const { submit, loading, error } = useSubmit(async (e) => {
    e.preventDefault();

    const d = Object.fromEntries(new FormData(e.target));

    if (d.password !== d.confirmPassword) {
      throw new Error("Passwords do not match");
    }

   

    d.gender = Number(d.gender);

    if (!d.DOB) {
      delete d.DOB;
    }

    await authApi.signup(d);

    nav(`/confirm?email=${encodeURIComponent(d.email)}`);
  });

  return (
    <form className="card" onSubmit={submit}>
      <h2>Create your account</h2>

      <p className="sub">
        Get your link, share it, receive anonymous messages.
      </p>

      <Alert error={error} />

      <label>Full name (first last)</label>
      <input
        name="username"
        required
        minLength={2}
        maxLength={50}
        placeholder="Ahmed Ali"
      />

      <label>Email</label>
      <input name="email" type="email" required />

      <label>Phone (E.164)</label>
      <input
        name="phone"
        type="tel"
        required
        placeholder="+201001234567"
      />

      <label>Date of birth</label>
      <input name="DOB" type="date" />

      <label>Gender</label>
      <select name="gender" defaultValue="0" required>
        <option value="0">Male</option>
        <option value="1">Female</option>
      </select>

      <label>Password</label>
      <input
        name="password"
        type="password"
        required
        minLength={8}
        maxLength={16}
        placeholder="8-16 chars, Aa, 1, !@#$%^&*_"
      />

      <label>Confirm password</label>
      <input
        name="confirmPassword"
        type="password"
        required
        minLength={8}
        maxLength={16}
      />

      <button className="btn" disabled={loading}>
        {loading ? "..." : "Sign up"}
      </button>
    </form>
  );
}
