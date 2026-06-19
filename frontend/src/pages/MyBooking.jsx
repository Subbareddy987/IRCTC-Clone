import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { myBookings } from "../services/autoService";
import "./MyBookings.css";

const MOCK = [
  {
    booking_id: "1", train_name: "Venkatadri Express", train_number: "12798",
    pnr_number: "PNR1781693534068", travel_date: "2026-06-18",
    source_station: "Secunderabad Jn", destination_station: "Chennai Central",
    booking_status: "CONFIRMED", coach: "B1", seat: "24 · SL", fare: "₹845",
  },
  {
    booking_id: "2", train_name: "Charminar Express", train_number: "12760",
    pnr_number: "PNR1781693512345", travel_date: "2026-07-02",
    source_station: "Hyderabad Deccan", destination_station: "Chennai Central",
    booking_status: "CONFIRMED", coach: "S4", seat: "12 · LB", fare: "₹520",
  },
  {
    booking_id: "3", train_name: "Falaknuma Express", train_number: "12701",
    pnr_number: "PNR1781001234567", travel_date: "2026-05-14",
    source_station: "Secunderabad Jn", destination_station: "Mumbai CST",
    booking_status: "CANCELLED", coach: "A2", seat: "08 · MB", fare: "₹1,240",
  },
];

function StatusBadge({ status }) {
  const map = {
    CONFIRMED: { cls: "badge--confirmed", icon: "✓", label: "Confirmed" },
    CANCELLED:  { cls: "badge--cancelled",  icon: "✕", label: "Cancelled" },
    WAITLISTED: { cls: "badge--wait",       icon: "⏳", label: "Waitlisted" },
  };
  const { cls, icon, label } = map[status] || map.CONFIRMED;
  return <span className={`mb-badge ${cls}`}>{icon} {label}</span>;
}

function BookingCard({ booking, onView }) {
  const date = new Date(booking.travel_date);
  const isPast = date < new Date();
  const isCancelled = booking.booking_status === "CANCELLED";

  const dd   = date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  const year = date.getFullYear();
  const day  = date.toLocaleDateString("en-IN", { weekday: "short" });

  return (
    <div className={`mb-card ${isCancelled ? "mb-card--cancelled" : ""} ${isPast && !isCancelled ? "mb-card--past" : ""}`}>

      {/* ── Left date strip ── */}
      <div className="mb-date-strip">
        <span className="mb-date-dd">{dd}</span>
        <span className="mb-date-yr">{year}</span>
        <span className="mb-date-day">{day}</span>
      </div>

      {/* ── Main body ── */}
      <div className="mb-body">

        {/* Row 1: train name + status */}
        <div className="mb-row-top">
          <div className="mb-train-info">
            <span className="mb-train-num">{booking.train_number}</span>
            <h3 className="mb-train-name">{booking.train_name}</h3>
          </div>
          <StatusBadge status={booking.booking_status} />
        </div>

        {/* Row 2: route */}
        <div className="mb-route">
          <div className="mb-station">
            <span className="mb-station-label">From</span>
            <span className="mb-station-name">{booking.source_station}</span>
          </div>
          <div className="mb-route-line">
            <span className="mb-route-dot" />
            <span className="mb-route-track" />
            <span className="mb-route-icon">🚆</span>
            <span className="mb-route-track" />
            <span className="mb-route-dot" />
          </div>
          <div className="mb-station mb-station--right">
            <span className="mb-station-label">To</span>
            <span className="mb-station-name">{booking.destination_station}</span>
          </div>
        </div>

        {/* Row 3: meta chips */}
        <div className="mb-meta">
          <span className="mb-chip">
            <span className="mb-chip-label">PNR</span>
            <span className="mb-chip-val">{booking.pnr_number}</span>
          </span>
          {booking.coach && (
            <span className="mb-chip">
              <span className="mb-chip-label">Coach</span>
              <span className="mb-chip-val">{booking.coach}</span>
            </span>
          )}
          {booking.seat && (
            <span className="mb-chip">
              <span className="mb-chip-label">Seat</span>
              <span className="mb-chip-val">{booking.seat}</span>
            </span>
          )}
          {booking.fare && (
            <span className="mb-chip mb-chip--fare">
              <span className="mb-chip-label">Fare</span>
              <span className="mb-chip-val">{booking.fare}</span>
            </span>
          )}
        </div>

      </div>

      {/* ── Action ── */}
      <div className="mb-actions">
        <button
          className={`mb-view-btn ${isCancelled ? "mb-view-btn--ghost" : ""}`}
          onClick={() => onView(booking.booking_id)}
        >
          {isCancelled ? "View Details" : "View Ticket"}
          <span className="mb-arrow">→</span>
        </button>
      </div>

    </div>
  );
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const response = await myBookings();
        setBookings(response.bookings);
      } catch {
        setBookings(MOCK); // fallback to mock
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const tabs = ["ALL", "CONFIRMED", "CANCELLED"];
  const filtered = filter === "ALL" ? bookings : bookings.filter(b => b.booking_status === filter);

  const confirmed = bookings.filter(b => b.booking_status === "CONFIRMED").length;
  const cancelled = bookings.filter(b => b.booking_status === "CANCELLED").length;

  if (loading) {
    return (
      <div className="mb-page">
        <div className="mb-loading">
          <div className="mb-spinner" />
          <p>Fetching your bookings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-page">
      <div className="mb-container">

        {/* ── Page header ── */}
        <div className="mb-page-header">
          <div>
            <h1 className="mb-page-title">My Bookings</h1>
            <p className="mb-page-sub">All your train journeys in one place</p>
          </div>
          <div className="mb-stats">
            <div className="mb-stat">
              <span className="mb-stat-val">{bookings.length}</span>
              <span className="mb-stat-label">Total</span>
            </div>
            <div className="mb-stat mb-stat--confirmed">
              <span className="mb-stat-val">{confirmed}</span>
              <span className="mb-stat-label">Confirmed</span>
            </div>
            <div className="mb-stat mb-stat--cancelled">
              <span className="mb-stat-val">{cancelled}</span>
              <span className="mb-stat-label">Cancelled</span>
            </div>
          </div>
        </div>

        {/* ── Filter tabs ── */}
        <div className="mb-tabs">
          {tabs.map(t => (
            <button
              key={t}
              className={`mb-tab ${filter === t ? "mb-tab--active" : ""}`}
              onClick={() => setFilter(t)}
            >
              {t === "ALL" ? `All (${bookings.length})` : t === "CONFIRMED" ? `Confirmed (${confirmed})` : `Cancelled (${cancelled})`}
            </button>
          ))}
        </div>

        {/* ── List ── */}
        {filtered.length === 0 ? (
          <div className="mb-empty">
            <div className="mb-empty-icon">🎫</div>
            <h2>No bookings here</h2>
            <p>You don't have any {filter !== "ALL" ? filter.toLowerCase() : ""} bookings yet.</p>
            <button className="mb-search-btn" onClick={() => navigate("/trains/search")}>
              Search Trains
            </button>
          </div>
        ) : (
          <div className="mb-list">
            {filtered.map((b, i) => (
              <div key={b.booking_id} style={{ animationDelay: `${i * 50}ms` }} className="mb-card-wrap">
                <BookingCard booking={b} onView={id => navigate(`/booking/${id}`)} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
