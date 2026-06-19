import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingDetails, cancelBooking } from "../services/autoService";
import { toast } from "react-toastify";
import "./BookingDetails.css";

function BookingDetails() {
  const { booking_id } = useParams();
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem("user") || "null");

  const [ticket, setTicket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    async function loadTicket() {
      try {
        const response = await getBookingDetails(booking_id);
        setTicket(response.booking);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    }
    loadTicket();
  }, [booking_id]);

  const handleCancel = async (booking_id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this ticket? This action cannot be undone."
    );
    if (!confirmCancel) return;

    setCancelling(true);
    try {
      const response = await cancelBooking(booking_id);
      toast.success(response.message);
      setTicket((prev) =>
        prev.map((item) => ({ ...item, booking_status: "CANCELLED" }))
      );
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Cancellation failed. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="bd-page">
        <div className="bd-loader">
          <div className="bd-spinner" />
          <p>Fetching your ticket…</p>
        </div>
      </div>
    );
  }

  if (ticket.length === 0) {
    return (
      <div className="bd-page">
        <div className="bd-empty">
          <div className="bd-empty-icon">🎫</div>
          <h2>Ticket Not Found</h2>
          <p>We couldn't find a booking with this ID.</p>
          <button className="bd-btn-back" onClick={() => navigate("/mybookings")}>
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const info = ticket[0];
  const isCancelled = info.booking_status === "CANCELLED";
  const formattedDate = new Date(info.travel_date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const routeText = info.source_station_code
    ? `${info.source_station_name} (${info.source_station_code}) to ${info.destination_station_name} (${info.destination_station_code})`
    : "Route details unavailable";

  const buildTicketText = () => [
    "IRCTC Train E-Ticket",
    `PNR: ${info.pnr_number}`,
    `Status: ${info.booking_status}`,
    `Train: ${info.train_number} - ${info.train_name}`,
    `Route: ${routeText}`,
    `Journey Date: ${formattedDate}`,
    `Passengers: ${ticket.length}`,
    "",
    "Passenger Details",
    ...ticket.map((p, index) => (
      `${index + 1}. ${p.passenger_name}, ${p.age} yrs, ${p.gender}, Seat ${p.coach_name}-${p.seat_number}${p.berth_type ? ` (${p.berth_type})` : ""}`
    )),
  ].join("\n");

  const downloadTicket = () => {
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>IRCTC Ticket ${info.pnr_number}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #172033; padding: 32px; }
      .ticket { max-width: 720px; border: 1px solid #d9e1ee; border-radius: 16px; padding: 28px; }
      h1 { margin: 0 0 6px; color: #123e72; }
      .muted { color: #6b778c; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; }
      .box { background: #f5f8fc; border-radius: 10px; padding: 14px; }
      .label { color: #6b778c; font-size: 11px; text-transform: uppercase; letter-spacing: .8px; }
      .value { display: block; margin-top: 5px; font-weight: 700; }
      table { width: 100%; border-collapse: collapse; margin-top: 14px; }
      th, td { text-align: left; padding: 10px; border-bottom: 1px solid #e4eaf3; }
      th { color: #6b778c; font-size: 12px; text-transform: uppercase; }
    </style>
  </head>
  <body>
    <section class="ticket">
      <p class="muted">Indian Railway Reservation System</p>
      <h1>Train E-Ticket</h1>
      <div class="grid">
        <div class="box"><span class="label">PNR</span><strong class="value">${info.pnr_number}</strong></div>
        <div class="box"><span class="label">Status</span><strong class="value">${info.booking_status}</strong></div>
        <div class="box"><span class="label">Train</span><strong class="value">${info.train_number} - ${info.train_name}</strong></div>
        <div class="box"><span class="label">Journey Date</span><strong class="value">${formattedDate}</strong></div>
        <div class="box" style="grid-column: 1 / -1"><span class="label">Route</span><strong class="value">${routeText}</strong></div>
      </div>
      <h2>Passengers</h2>
      <table>
        <thead><tr><th>Name</th><th>Age</th><th>Gender</th><th>Seat</th></tr></thead>
        <tbody>
          ${ticket.map((p) => `<tr><td>${p.passenger_name}</td><td>${p.age}</td><td>${p.gender}</td><td>${p.coach_name}-${p.seat_number} ${p.berth_type || ""}</td></tr>`).join("")}
        </tbody>
      </table>
    </section>
  </body>
</html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `IRCTC-Ticket-${info.pnr_number}.html`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Ticket downloaded");
  };

  const emailTicket = () => {
    const email = savedUser?.email;
    const subject = encodeURIComponent(`IRCTC Ticket ${info.pnr_number}`);
    const body = encodeURIComponent(buildTicketText());

    if (!email) {
      toast.info("No saved email found. Opening your mail app.");
    }

    window.location.href = `mailto:${email || ""}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bd-page">
      <div className="bd-card">
        {/* Header */}
        <div className="bd-header">
          <div className="bd-header-left">
            <div className="bd-train-icon">🚆</div>
            <div>
              <h1 className="bd-title">Train E-Ticket</h1>
              <p className="bd-subtitle">Indian Railway Reservation System</p>
            </div>
          </div>
          <span className={`bd-status ${isCancelled ? "bd-status--cancelled" : "bd-status--confirmed"}`}>
            {isCancelled ? "✕ Cancelled" : "✓ Confirmed"}
          </span>
        </div>

        {/* Divider with perforation effect */}
        <div className="bd-divider" />

        {/* Booking Info Grid */}
        <div className="bd-info-grid">
          <div className="bd-info-item">
            <span className="bd-info-label">PNR Number</span>
            <strong className="bd-info-value bd-pnr">{info.pnr_number}</strong>
          </div>
          <div className="bd-info-item">
            <span className="bd-info-label">Train</span>
            <strong className="bd-info-value">
              {info.train_number} – {info.train_name}
            </strong>
          </div>
          <div className="bd-info-item">
            <span className="bd-info-label">Journey Date</span>
            <strong className="bd-info-value">
              {formattedDate}
            </strong>
          </div>
          <div className="bd-info-item">
            <span className="bd-info-label">Total Passengers</span>
            <strong className="bd-info-value">{ticket.length}</strong>
          </div>
        </div>

        {info.source_station_code && (
          <div className="bd-route-box">
            <div>
              <span className="bd-info-label">From</span>
              <strong>{info.source_station_name}</strong>
              <small>{info.source_station_code}</small>
            </div>
            <span className="bd-route-mid">to</span>
            <div>
              <span className="bd-info-label">To</span>
              <strong>{info.destination_station_name}</strong>
              <small>{info.destination_station_code}</small>
            </div>
          </div>
        )}

        {/* Ticket Tear Line */}
        <div className="bd-tear-line">
          <div className="bd-tear-circle bd-tear-circle--left" />
          <div className="bd-tear-dashes" />
          <div className="bd-tear-circle bd-tear-circle--right" />
        </div>

        {/* Passengers */}
        <div className="bd-passengers">
          <h2 className="bd-section-title">Passenger Details</h2>
          <div className="bd-passenger-list">
            {ticket.map((p, index) => (
              <div className="bd-passenger" key={index}>
                <div className="bd-avatar">
                  {p.passenger_name.charAt(0).toUpperCase()}
                </div>
                <div className="bd-passenger-info">
                  <p className="bd-passenger-name">{p.passenger_name}</p>
                  <p className="bd-passenger-meta">
                    {p.gender} &bull; {p.age} yrs
                  </p>
                </div>
                <div className="bd-seat">
                  <strong className="bd-seat-code">
                    {p.coach_name}-{p.seat_number}
                  </strong>
                  <span className="bd-berth">{p.berth_type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bd-actions">
          <button className="bd-btn-download" onClick={downloadTicket}>
            Download Ticket
          </button>
          <button className="bd-btn-email" onClick={emailTicket}>
            Email Ticket
          </button>
          {!isCancelled && (
            <button
              className="bd-btn-cancel"
              onClick={() => handleCancel(info.booking_id)}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling…" : "Cancel Ticket"}
            </button>
          )}
          <button
            className="bd-btn-back"
            onClick={() => navigate("/mybookings")}
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;
