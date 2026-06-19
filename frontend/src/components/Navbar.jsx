import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/home", label: "Home" },
    { to: "/trains/search", label: "Search Trains" },
    { to: "/mybookings", label: "My Bookings" },
    { to: "/pnr-search", label: "PNR Status" },
    { to: "/about-developer", label: "Developer" },
  ];

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <nav className="nb">
      <div className="nb__inner">
        {/* ── Logo ── */}
        <Link to="/home" className="nb__logo">
          <img
            src="/vandebharat.jpeg"
            alt="Vande Bharat"
            style={{
              height: "36px",
              width: "64px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
          <span className="nb__logo-text">
            <strong>IRCTC</strong>
            <em>Rail Booking</em>
          </span>
        </Link>

        {/* ── Desktop links ── */}
        <ul className="nb__links">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`nb__link ${isActive(to) ? "nb__link--active" : ""}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Right side ── */}
        <div className="nb__right">
          {user ? (
            <>
              <div className="nb__user">
                <div className="nb__avatar">{initials}</div>
                <span className="nb__username">{user.name}</span>
              </div>
              <button className="nb__logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nb__login-btn">
              Sign In
            </Link>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className={`nb__ham ${menuOpen ? "nb__ham--open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <div className={`nb__drawer ${menuOpen ? "nb__drawer--open" : ""}`}>
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`nb__drawer-link ${isActive(to) ? "nb__drawer-link--active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        <div className="nb__drawer-foot">
          {user && <span className="nb__drawer-user">👤 {user.name}</span>}
          <button
            className="nb__logout nb__logout--mobile"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
