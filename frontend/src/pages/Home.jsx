import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/autoService";
import "./Home.css";

/* ── Inline SVG icon set ─────────────────────────────────── */
const Icon = {
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Ticket: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
      <line x1="9" y1="2" x2="9" y2="22"/><line x1="15" y1="2" x2="15" y2="22"/>
    </svg>
  ),
  PNR: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  History: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Map: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  ),
  Train: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/>
      <path d="M12 3v8"/><circle cx="8.5" cy="17" r="1.5"/><circle cx="15.5" cy="17" r="1.5"/>
      <path d="M8.5 19L7 21"/><path d="M15.5 19L17 21"/>
    </svg>
  ),
  Arrow: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
};

function Home() {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProfile();
  }, []);

  const quickActions = [
    { icon: <Icon.Search />, label: "Search Trains", desc: "Find trains between stations and check seat availability.", path: "/trains/search", accent: "#1B4F8A" },
    { icon: <Icon.Ticket />, label: "My Bookings", desc: "View confirmed, cancelled and upcoming journeys.", path: "/mybookings", accent: "#FF6B00" },
    { icon: <Icon.PNR />, label: "PNR Status", desc: "Track ticket confirmation and current journey status.", path: "/pnr-search", accent: "#1B4F8A" },
    { icon: <Icon.History />, label: "Booking History", desc: "Access your complete reservation history instantly.", path: "/mybookings", accent: "#FF6B00" },
  ];

  const features = [
    { icon: <Icon.Clock />, title: "24×7 Booking", desc: "Book railway tickets anytime, from anywhere in India — no counters, no queues." },
    { icon: <Icon.Shield />, title: "Secure Payments", desc: "UPI, Debit Cards, Credit Cards and Net Banking — fully encrypted transactions." },
    { icon: <Icon.Zap />, title: "Instant Confirmation", desc: "Your PNR and booking confirmation arrive the moment you complete payment." },
    { icon: <Icon.Map />, title: "Live PNR Tracking", desc: "Check booking status, waitlist movement and live journey updates anytime." },
  ];

  const stats = [
    { value: "13,000+", label: "Daily Trains" },
    { value: "7,000+", label: "Railway Stations" },
    { value: "23M+", label: "Passengers Daily" },
    { value: "24×7", label: "Service Available" },
  ];

  const routes = [
    { from: "Nellore", to: "Hyderabad" },
    { from: "Vijayawada", to: "Chennai" },
    { from: "Guntur", to: "Bangalore" },
    { from: "Hyderabad", to: "Visakhapatnam" },
    { from: "Chennai", to: "Delhi" },
    { from: "Mumbai", to: "Hyderabad" },
  ];
  const profile = user?.user;

  return (
    <div className="home-root">

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="home-hero">
        <div className="hero-bg">
          <div className="hero-overlay" />
        </div>

        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            Indian Railway Catering &amp; Tourism Corporation
          </div>

          <h1 className="hero-title">
            {user?.user?.full_name ? (
              <>Namaste <span className="hero-name">{user.user.full_name}</span></>
            ) : (
              <>Your Journey<br /><span className="hero-name">Starts Here</span></>
            )}
          </h1>

          <p className="hero-sub">
            Book train tickets, check PNR status and manage every railway
            journey across India — all from one platform.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate("/trains/search")}>
              <Icon.Train />
              Book Train Tickets
            </button>
            <button className="btn-ghost" onClick={() => navigate("/pnr-search")}>
              <Icon.PNR />
              Check PNR Status
            </button>
            {profile && (
              <button className="btn-ghost" onClick={() => setShowProfile((value) => !value)}>
                <Icon.Shield />
                {showProfile ? "Hide Profile" : "View Profile"}
              </button>
            )}
          </div>

          {showProfile && profile && (
            <div className="home-profile-card">
              <div className="home-profile-avatar">
                {profile.full_name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="home-profile-info">
                <span className="home-profile-label">Signed in as</span>
                <strong>{profile.full_name}</strong>
                <p>{profile.email}</p>
              </div>
              <button className="home-profile-action" onClick={() => navigate("/mybookings")}>
                My Bookings
              </button>
            </div>
          )}
        </div>

        {/* scroll cue */}
        <div className="hero-scroll-cue">
          <div className="scroll-dot" />
        </div>
      </section>

      {/* ── QUICK SERVICES ─────────────────────────────────── */}
      <section className="home-section bg-white">
        <div className="section-inner">
          <div className="section-label">Quick Services</div>
          <h2 className="section-title">What would you like to do?</h2>

          <div className="quick-grid">
            {quickActions.map((a) => (
              <button
                key={a.label}
                className="quick-card"
                onClick={() => navigate(a.path)}
                style={{ "--accent": a.accent }}
              >
                <div className="quick-icon">{a.icon}</div>
                <div className="quick-body">
                  <h3>{a.label}</h3>
                  <p>{a.desc}</p>
                </div>
                <span className="quick-arrow"><Icon.Arrow /></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS (journey line) ────────────────────────────── */}
      <section className="home-section bg-navy">
        <div className="section-inner">
          <div className="section-label light">Indian Railways Network</div>
          <h2 className="section-title light">The world's largest rail network</h2>

          <div className="stats-track">
            {stats.map((s, i) => (
              <div key={s.label} className="stat-node">
                <div className="stat-station" />
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                {i < stats.length - 1 && <div className="stat-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY IRCTC ──────────────────────────────────────── */}
      <section className="home-section bg-mist">
        <div className="section-inner">
          <div className="section-label">Why Choose IRCTC?</div>
          <h2 className="section-title">Built for every Indian traveller</h2>

          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-body">
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR ROUTES ─────────────────────────────────── */}
      <section className="home-section bg-white">
        <div className="section-inner">
          <div className="section-label">Popular Routes</div>
          <h2 className="section-title">Frequently travelled corridors</h2>

          <div className="routes-grid">
            {routes.map((r) => (
              <button
                key={`${r.from}-${r.to}`}
                className="route-chip"
                onClick={() => navigate("/trains/search")}
              >
                <span className="route-from">{r.from}</span>
                <span className="route-sep">
                  <span className="route-line" />
                  <Icon.Train />
                  <span className="route-line" />
                </span>
                <span className="route-to">{r.to}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER BAND ────────────────────────────────────── */}
      <footer className="home-footer">
        <div className="footer-brand">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#FF6B00"/>
            <path d="M6 22 L16 8 L26 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="16" cy="24" r="2.5" fill="white"/>
          </svg>
          <span>IRCTC</span>
        </div>
        <p>© {new Date().getFullYear()} IRCTC Ltd. Ministry of Railways, Government of India.</p>
      </footer>

    </div>
  );
}

export default Home;
