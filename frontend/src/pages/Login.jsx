
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

    const data = await authApi.login(
      Object.fromEntries(new FormData(e.target))
    );

    login(data);
    nav("/inbox");
  });

  return (
    <div className="login-page">
      <div className="login-showcase">
        <div className="showcase-glow"></div>

        <div className="showcase-brand">
          <span className="brand-symbol">✦</span>
          ANNONIFY
        </div>

        <div className="showcase-content">
          <span className="showcase-tag">
            THE ANONYMOUS EXPERIENCE
          </span>

          <h1>
            Words worth
            <br />
            <em>sharing.</em>
          </h1>

          <p>
            A little mystery. A lot of honesty.
            Discover what people really want to tell you.
          </p>

          <div className="floating-messages">
            <div className="floating-message message-one">
              <span>✉ Anonymous message</span>
              <strong>
                Someone thinks you're amazing ✨
              </strong>
            </div>

            <div className="floating-message message-two">
              <span>Just received</span>
              <strong>
                Keep being yourself!
              </strong>
              <span>♡</span>
            </div>

            <div className="floating-message message-three">
              <span>✦ A little secret</span>
              <strong>
                You made someone's day.
              </strong>
            </div>
          </div>
        </div>

        <div className="showcase-footer">
          YOUR SPACE. YOUR STORIES.
          <span>✧ ✧ ✧</span>
        </div>
      </div>

      <div className="login-panel">
        <div className="login-form-wrapper">
          <div className="login-welcome-icon">
            ✉
          </div>

          <span className="login-eyebrow">
            NICE TO SEE YOU AGAIN
          </span>

          <h2>Welcome back.</h2>

          <p className="login-description">
            Your messages are waiting for you.
            Sign in to see what's new.
          </p>

          <form onSubmit={submit} className="login-form">
            <Alert error={error} />

            <label htmlFor="login-email">
              Email address
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <div className="login-password-heading">
              <label htmlFor="login-password">
                Password
              </label>

              <Link to="/forgot-password">
                Forgot password?
              </Link>
            </div>

            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            <button
  type="submit"
  className="btn login-submit"
  disabled={loading}
>
  {loading ? "Signing in..." : "Sign in →"}
</button>

<p
  className="sub"
  style={{
    textAlign: "center",
    marginTop: "14px",
    marginBottom: "8px",
  }}
>
  Haven't verified your email?{" "}
  <Link to="/confirm">
    Confirm your email
  </Link>
</p>
          </form>

          <div className="login-divider">
            <span></span>
            <span>NEW TO ANNONIFY?</span>
            <span></span>
          </div>

          <Link
            to="/signup"
            className="login-create-account"
          >
            Create your account
            <span>↗</span>
          </Link>

          <p className="login-privacy">
            ✦ A space for honest conversations.
          </p>
        </div>
      </div>
    </div>
  );
}
