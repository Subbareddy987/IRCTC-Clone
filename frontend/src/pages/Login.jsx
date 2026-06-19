import { useState } from "react";
import { loginuser } from "../services/autoService";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { toast } from "react-toastify";
function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginuser({ email, password });
      
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      toast.success("Login Successful");
      navigate("/home");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* Background layer */}
      <div className="login-bg">
        <div className="bg-overlay" />
        <div className="track-lines">
          <div className="track" />
          <div className="track" />
        </div>
      </div>

      {/* Main content */}
      <div className="login-wrapper">
        {/* Header brand bar */}
        <div className="brand-bar">
          <div className="brand-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#FF6B00" />
              <path d="M6 22 L16 8 L26 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="16" cy="24" r="2.5" fill="white"/>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">IRCTC</span>
            <span className="brand-tagline">Indian Railway Catering & Tourism Corporation</span>
          </div>
        </div>

        {/* Login card */}
        <div className="login-card">
          {/* Rail accent line */}
          <div className="rail-accent">
            <div className="rail-line" />
            <div className="rail-sleeper" />
            <div className="rail-sleeper" />
            <div className="rail-sleeper" />
            <div className="rail-sleeper" />
            <div className="rail-sleeper" />
            <div className="rail-line" />
          </div>

          <div className="card-body">
            <div className="card-header">
              <h1 className="card-title">Welcome Back</h1>
              <p className="card-subtitle">Sign in to book your journey</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <div className="field-group">
                <label htmlFor="email" className="field-label">
                  Email / User ID
                </label>
                <div className="field-wrapper">
                  <span className="field-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    className="field-input"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field-group">
                <div className="label-row">
                  <label htmlFor="password" className="field-label">Password</label>
                  <a href="#" className="forgot-link">Forgot Password?</a>
                </div>
                <div className="field-wrapper">
                  <span className="field-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    className="field-input"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-pw"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`login-btn ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <span className="divider-line" />
              <span className="divider-text">New to IRCTC?</span>
              <span className="divider-line" />
            </div>

            <Link to="/register" className="register-btn">
              Create an Account
            </Link>

            <p className="terms-note">
              By signing in, you agree to IRCTC's{" "}
              <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>
            </p>
          </div>
        </div>

        <p className="footer-note">
          © {new Date().getFullYear()} IRCTC Ltd. Ministry of Railways, Government of India.
        </p>
      </div>
    </div>
  );
}

export default Login;
