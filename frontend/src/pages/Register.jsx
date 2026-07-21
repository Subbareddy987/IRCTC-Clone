import { useState } from "react";
 import { registeruser } from "../services/autoService";
 import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import { toast } from "react-toastify";
function Register() {
  const [full_name, setfullname] = useState("");
  const [email, setemail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState("");

  const captchaText = "IRCTC2026";
  const [captchaInput, setCaptchaInput] = useState("");

  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 8) return { label: "Weak", level: 1 };
    if (password.length < 12) return { label: "Medium", level: 2 };
    return { label: "Strong", level: 3 };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast("Passwords do not match");
      return;
    }
    if (captchaInput !== captchaText) {
      toast("Invalid Captcha. Enter: IRCTC2026");
      return;
    }
    try{
      const response = await registeruser({ full_name,email, password });
            
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
            toast.success(`${full_name} Registered Successfully`);
            navigate("/home");
            console.log(response);
    }catch(error){
        console.error(error)
        toast.error(error.response?.data?.message || "Registration Failed")
    }
    
    
    //  navigate("/login");
  };

  return (
    <div className="rp-root">
      {/* LEFT PANEL */}
      <div className="rp-left">
        {/* Decorative geometric pattern */}
        <div className="rp-pattern" aria-hidden="true">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="rp-diamond" style={{ "--i": i }} />
          ))}
        </div>

        <div className="rp-left-content">
          <div className="rp-badge">🇮🇳 Ministry of Railways</div>

          <h1 className="rp-brand">
            <span className="rp-brand-ir">IRCTC</span>
            <span className="rp-brand-sub">Indian Railway Catering &amp; Tourism</span>
          </h1>

          <p className="rp-tagline">
            Connecting a billion journeys — fast, secure, and seamless.
          </p>

          {/* Animated Train */}
          <div className="rp-train-scene" aria-hidden="true">
            <div className="rp-track">
              <div className="rp-rail rp-rail-top" />
              <div className="rp-sleepers">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="rp-sleeper" />
                ))}
              </div>
              <div className="rp-rail rp-rail-bottom" />
              <div className="rp-train">
                <div className="rp-engine">
                  <div className="rp-cab" />
                  <div className="rp-chimney">
                    <div className="rp-smoke" />
                    <div className="rp-smoke rp-smoke-2" />
                    <div className="rp-smoke rp-smoke-3" />
                  </div>
                  <div className="rp-headlight" />
                  <div className="rp-wheel rp-wheel-1" />
                  <div className="rp-wheel rp-wheel-2" />
                </div>
                <div className="rp-coach rp-coach-1">
                  <div className="rp-window" /><div className="rp-window" />
                  <div className="rp-wheel" /><div className="rp-wheel" />
                </div>
                <div className="rp-coach rp-coach-2">
                  <div className="rp-window" /><div className="rp-window" />
                  <div className="rp-wheel" /><div className="rp-wheel" />
                </div>
              </div>
            </div>
          </div>

          <ul className="rp-features">
            {[
              ["🎫", "Instant Ticket Booking"],
              ["📍", "Live Train Tracking"],
              ["🔔", "PNR & Alert Notifications"],
              ["💳", "100+ Payment Options"],
              ["🛡️", "Bank-Grade Security"],
            ].map(([icon, text]) => (
              <li key={text} className="rp-feature-item">
                <span className="rp-feature-icon">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Saffron stripe accent */}
        <div className="rp-stripe-saffron" />
        <div className="rp-stripe-green" />
      </div>

      {/* RIGHT PANEL */}
      <div className="rp-right">
        <div className="rp-card">
          <div className="rp-card-header">
            <div className="rp-avatar">🚆</div>
            <h2 className="rp-title">Create Account</h2>
            <p className="rp-subtitle">Your journey begins here</p>
          </div>

          <form className="rp-form" onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className={`rp-field ${focused === "name" ? "rp-field--active" : ""} ${full_name ? "rp-field--filled" : ""}`}>
              <label className="rp-label" htmlFor="rp-name">Full Name</label>
              <div className="rp-input-wrap">
                <span className="rp-input-icon">👤</span>
                <input
                  id="rp-name"
                  className="rp-input"
                  type="text"
                  placeholder="Enter Your name"
                  value={full_name}
                  onChange={(e) => setfullname(e.target.value)}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused("")}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className={`rp-field ${focused === "email" ? "rp-field--active" : ""} ${email ? "rp-field--filled" : ""}`}>
              <label className="rp-label" htmlFor="rp-email">Email Address</label>
              <div className="rp-input-wrap">
                <span className="rp-input-icon">✉️</span>
                <input
                  id="rp-email"
                  className="rp-input"
                  type="email"
                  placeholder="Enter Your Mail"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  required
                />
              </div>
            </div>

            {/* Mobile */}
            <div className={`rp-field ${focused === "mobile" ? "rp-field--active" : ""} ${mobile ? "rp-field--filled" : ""}`}>
              <label className="rp-label" htmlFor="rp-mobile">Mobile Number</label>
              <div className="rp-input-wrap">
                <span className="rp-input-icon">📱</span>
                <input
                  id="rp-mobile"
                  className="rp-input"
                  type="tel"
                  placeholder="Enter Your Mobile Number (Optional)"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  onFocus={() => setFocused("mobile")}
                  onBlur={() => setFocused("")}
                />
              </div>
            </div>

            {/* Password row */}
            <div className="rp-row">
              <div className={`rp-field ${focused === "pw" ? "rp-field--active" : ""} ${password ? "rp-field--filled" : ""}`}>
                <label className="rp-label" htmlFor="rp-pw">Password</label>
                <div className="rp-input-wrap">
                  
                  <input
                    id="rp-pw"
                    className="rp-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    onFocus={() => setFocused("pw")}
                    onBlur={() => setFocused("")}
                    required
                  />
                  <button type="button" className="rp-eye" onClick={() => setShowPassword(v => !v)} aria-label="Toggle password">
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className={`rp-field ${focused === "cpw" ? "rp-field--active" : ""} ${confirmPassword ? "rp-field--filled" : ""}`}>
                <label className="rp-label" htmlFor="rp-cpw">Confirm Password</label>
                <div className="rp-input-wrap">
                  
                  <input
                    id="rp-cpw"
                    className="rp-input"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocused("cpw")}
                    onBlur={() => setFocused("")}
                    required
                  />
                  <button type="button" className="rp-eye" onClick={() => setShowConfirm(v => !v)} aria-label="Toggle confirm password">
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            </div>

            {/* Password strength bar */}
            {strength && (
              <div className="rp-strength">
                <div className="rp-strength-bars">
                  {[1, 2, 3].map(l => (
                    <div key={l} className={`rp-strength-bar ${strength.level >= l ? `rp-strength-bar--${["", "weak", "medium", "strong"][strength.level]}` : ""}`} />
                  ))}
                </div>
                <span className={`rp-strength-label rp-strength-label--${["", "weak", "medium", "strong"][strength.level]}`}>
                  {strength.label} password
                </span>
              </div>
            )}

            {/* Captcha */}
            <div className="rp-captcha-section">
              <label className="rp-label">Security Verification</label>
              <div className="rp-captcha-wrap">
                <div className="rp-captcha-display">
                  <span className="rp-captcha-noise" aria-hidden="true">░</span>
                  <span className="rp-captcha-text">{captchaText}</span>
                  <span className="rp-captcha-noise" aria-hidden="true">▒</span>
                </div>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon">🛡️</span>
                  <input
                    className="rp-input"
                    type="text"
                    placeholder="Type the code above"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    required
                  />
                  {captchaInput === captchaText && <span className="rp-captcha-ok">✓</span>}
                </div>
              </div>
            </div>

            {/* Security note */}
            <div className="rp-security">
              <span className="rp-security-dot" />
              <span>256-bit SSL encrypted · Your data is safe with us</span>
            </div>

            {/* Submit */}
            <button type="submit" className="rp-submit">
              <span>Create My Account</span>
              <span className="rp-submit-arrow">→</span>
            </button>
          </form>

          <p className="rp-login-link">
            Already have an account?{" "}
            <Link to="/" className="rp-login-anchor">
              Login here
            </Link>
          </p>

          <div className="rp-divider-wrap">
            <span className="rp-divider-line" />
            <span className="rp-divider-text">Trusted by 10 Crore+ passengers</span>
            <span className="rp-divider-line" />
          </div>
        </div>
      </div>
    </div>
  );
}   

export default Register;
