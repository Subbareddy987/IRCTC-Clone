import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";
import { createBooking } from "../services/autoService";
import "./Payment.css";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;
  const [loading, setLoading] = useState(false);

  if (!bookingData) {
    return (
      <div className="py-page">
        <div className="py-invalid">
          <span className="py-invalid-icon">!</span>
          <h2>Invalid Booking Session</h2>
          <p>No booking data found. Please start your booking again.</p>
          <button className="py-back-btn" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const passengerCount = bookingData.passengers.length;
  const stationGap = Number(bookingData.segment_stop_count || 0);
  const fareMap = { Sleeper: 176, "3A": 384, "2A": 782 };
  const baseFare = fareMap[bookingData.coach_type] || 100;
  const farePerPassenger = baseFare + stationGap * 87;
  const ticketFare = farePerPassenger * passengerCount;
  const foodSummary = bookingData.food_summary || [];
  const foodTotal = Number(bookingData.food_total || 0);
  const totalFare = ticketFare + foodTotal;
  const upiLink = `upi://pay?pa=kambamsubbareddy987@axl&pn=IRCTC Reservation&am=${totalFare}&cu=INR`;

  const formattedDate = new Date(bookingData.travel_date).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await createBooking(bookingData);
      toast.success(response.message);
      toast.success("Payment successful!");
      navigate("/mybookings");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Payment failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-page">
      <div className="py-container">
        <div className="py-page-header">
          <div className="py-lock-icon">Pay</div>
          <div>
            <h1 className="py-page-title">Secure Payment</h1>
            <p className="py-page-sub">Review your booking and pay via UPI</p>
          </div>
        </div>

        <div className="py-steps">
          <span className="py-step py-step--done">Search</span>
          <span className="py-step-arrow">/</span>
          <span className="py-step py-step--done">Seat Selection</span>
          <span className="py-step-arrow">/</span>
          <span className="py-step py-step--done">Food Selection</span>
          <span className="py-step-arrow">/</span>
          <span className="py-step py-step--active">Payment</span>
        </div>

        <div className="py-grid">
          <div className="py-left">
            <div className="py-card">
              <div className="py-card-head">
                <span className="py-card-icon">Train</span>
                <h2 className="py-card-title">Journey Details</h2>
              </div>
              <div className="py-detail-grid">
                <div className="py-detail-item">
                  <span className="py-detail-label">Train</span>
                  <strong className="py-detail-val py-mono">
                    {bookingData.train_number} - {bookingData.train_name}
                  </strong>
                </div>
                <div className="py-detail-item">
                  <span className="py-detail-label">Journey Date</span>
                  <strong className="py-detail-val">{formattedDate}</strong>
                </div>
                <div className="py-detail-item">
                  <span className="py-detail-label">Coach Class</span>
                  <strong className="py-detail-val">
                    <span className="py-coach-badge">
                      {bookingData.coach_name} - {bookingData.coach_type}
                    </span>
                  </strong>
                </div>
                <div className="py-detail-item">
                  <span className="py-detail-label">Route</span>
                  <strong className="py-detail-val">
                    {bookingData.source_station_name} (
                    {bookingData.source_station_code}) to{" "}
                    {bookingData.destination_station_name} (
                    {bookingData.destination_station_code})
                  </strong>
                </div>
                <div className="py-detail-item">
                  <span className="py-detail-label">Passengers</span>
                  <strong className="py-detail-val">{passengerCount}</strong>
                </div>
              </div>
            </div>

            <div className="py-card">
              <div className="py-card-head">
                <span className="py-card-icon">PAX</span>
                <h2 className="py-card-title">Passengers</h2>
              </div>
              <div className="py-pax-list">
                {bookingData.passengers.map((p, i) => (
                  <div key={i} className="py-pax-row">
                    <div className="py-avatar">
                      {p.passenger_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="py-pax-info">
                      <p className="py-pax-name">{p.passenger_name}</p>
                      <p className="py-pax-meta">
                        {p.age} yrs - {p.gender}
                      </p>
                    </div>
                    <div className="py-pax-seat">
                      <strong className="py-seat-code">
                        {p.coach_name}-{p.seat_number}
                      </strong>
                      {p.berth_type && (
                        <span className="py-berth">{p.berth_type}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="py-card">
              <div className="py-card-head">
                <span className="py-card-icon">Food</span>
                <h2 className="py-card-title">Food Order</h2>
              </div>
              {foodSummary.length === 0 ? (
                <div className="py-food-empty">
                  No food selected for this journey.
                </div>
              ) : (
                <div className="py-food-list">
                  {foodSummary.map((item) => (
                    <div
                      className="py-food-row"
                      key={`${item.delivery_station}-${item.food_id}`}
                    >
                      <div>
                        <strong>{item.food_name}</strong>
                        <span>
                          {item.station_name || item.delivery_station} x{" "}
                          {item.quantity}
                        </span>
                      </div>
                      <b>
                        Rs{" "}
                        {(
                          Number(item.price) * item.quantity
                        ).toLocaleString("en-IN")}
                      </b>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="py-right">
            <div className="py-card py-fare-card">
              <div className="py-card-head">
                <span className="py-card-icon">Fare</span>
                <h2 className="py-card-title">Fare Summary</h2>
              </div>
              <div className="py-fare-rows">
                <div className="py-fare-row">
                  <span>Base fare ({bookingData.coach_type})</span>
                  <span>Rs {baseFare}</span>
                </div>
                <div className="py-fare-row">
                  <span>Journey charge ({stationGap} stops x Rs 87)</span>
                  <span>Rs {stationGap * 87}</span>
                </div>
                <div className="py-fare-row">
                  <span>Fare per passenger</span>
                  <span>Rs {farePerPassenger}</span>
                </div>
                <div className="py-fare-row py-fare-row--sub">
                  <span>
                    x {passengerCount} passenger
                    {passengerCount > 1 ? "s" : ""}
                  </span>
                  <span>Rs {ticketFare.toLocaleString("en-IN")}</span>
                </div>
                <div className="py-fare-row">
                  <span>Food order</span>
                  <span>Rs {foodTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="py-fare-divider" />
                <div className="py-fare-row py-fare-total">
                  <span>Total Amount</span>
                  <span className="py-total-amount">
                    Rs {totalFare.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="py-card py-upi-card">
              <div className="py-card-head">
                <span className="py-card-icon">UPI</span>
                <h2 className="py-card-title">Pay via UPI</h2>
              </div>
              <div className="py-qr-wrap">
                <div className="py-qr-frame">
                  <QRCodeCanvas value={upiLink} size={160} level="H" />
                </div>
                <p className="py-qr-hint">
                  Scan with PhonePe, Google Pay, Paytm or any UPI app
                </p>
                <div className="py-upi-apps">
                  <span className="py-upi-chip">PhonePe</span>
                  <span className="py-upi-chip">GPay</span>
                  <span className="py-upi-chip">Paytm</span>
                  <span className="py-upi-chip">BHIM</span>
                </div>
              </div>
            </div>

            <button
              className={`py-pay-btn ${loading ? "py-pay-btn--loading" : ""}`}
              disabled={loading}
              onClick={handlePayment}
            >
              {loading ? (
                <>
                  <span className="py-btn-spinner" />
                  Processing...
                </>
              ) : (
                <>Confirm and Pay Rs {totalFare.toLocaleString("en-IN")}</>
              )}
            </button>
            <p className="py-secure-note">
              Your payment is secured by 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
