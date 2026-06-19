import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import A1Coach from "../components/A1Coach.jsx";
import B1Coach from "../components/B1Coach.jsx";
import SleeperCoach from "../components/Sleepercoach.jsx";
import { getSeats } from "../services/autoService";
import "./SeatSelection.css";

function SeatSelection() {
  const { train_id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const travel_date = searchParams.get("date");
  const coach_name = searchParams.get("coachName");
  const coach_type = searchParams.get("coachType");
  const source_station_id = searchParams.get("source");
  const destination_station_id = searchParams.get("destination");
  const source_station_code = searchParams.get("sourceCode");
  const destination_station_code = searchParams.get("destinationCode");
  const source_station_name = searchParams.get("sourceName");
  const destination_station_name = searchParams.get("destinationName");
  const segment_stop_count = Number(searchParams.get("stops") || 0);

  const [seats, setSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [passengers, setPassengers] = useState([
    {
      passenger_name: "",
      age: "",
      gender: "Male",
      berth_preference: "No Preference",
      seat_id: null,
      seat_number: null,
      coach_name: null,
      berth_type: null,
    },
  ]);
  const [activePassenger, setActivePassenger] = useState(0);

  useEffect(() => {
    async function loadSeats() {
      setLoadingSeats(true);
      try {
        if (!travel_date || !coach_name || !coach_type || !source_station_id || !destination_station_id) {
          throw new Error("Incomplete journey or coach selection");
        }
        const response = await getSeats(train_id, travel_date, coach_name);
        setSeats(response.seats);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load seat data");
      } finally {
        setLoadingSeats(false);
      }
    }

    loadSeats();
  }, [train_id, travel_date, coach_name, coach_type, source_station_id, destination_station_id]);

  const addPassenger = () => {
    

    const newIndex = passengers.length;
    setPassengers([
      ...passengers,
      {
        passenger_name: "",
        age: "",
        gender: "Male",
        berth_preference: "No Preference",
        seat_id: null,
        seat_number: null,
        coach_name: null,
        berth_type: null,
      },
    ]);
    setActivePassenger(newIndex);
  };

  const removePassenger = (index) => {
    if (passengers.length <= 1) {
      toast.warning("At least one passenger is required");
      return;
    }
    const updated = passengers.filter((_, i) => i !== index);
    setPassengers(updated);
    setActivePassenger(Math.min(activePassenger, updated.length - 1));
  };

  const assignSeat = (seat) => {
    if (seat.status !== "AVAILABLE") {
      toast.warning("This seat is not available");
      return;
    }
    if (passengers.some((p) => p.seat_id === seat.seat_id)) {
      toast.warning("Seat already assigned to another passenger");
      return;
    }

    const updated = [...passengers];
    updated[activePassenger] = {
      ...updated[activePassenger],
      seat_id: seat.seat_id,
      seat_number: seat.seat_number,
      coach_name: seat.coach_name,
      berth_type: seat.berth_type || null,
    };
    setPassengers(updated);
    toast.success(`Seat ${seat.coach_name}-${seat.seat_number} assigned to Passenger ${activePassenger + 1}`);
  };

  const clearSeatAssignment = (index) => {
    const updated = [...passengers];
    updated[index] = {
      ...updated[index],
      seat_id: null,
      seat_number: null,
      coach_name: null,
      berth_type: null,
    };
    setPassengers(updated);
    toast.info("Seat cleared");
  };

  const handleBooking = () => {
    const incomplete = passengers.find((p) => !p.passenger_name.trim() || !p.age || !p.seat_id);
    if (incomplete) {
      toast.error("Please complete all passenger details and select seats");
      return;
    }

    navigate("/payment", {
      state: {
        train_id,
        train_number: location.state?.train_number,
        train_name: location.state?.train_name,
        travel_date,
        coach_type,
        coach_name,
        source_station_id,
        destination_station_id,
        source_station_code,
        destination_station_code,
        source_station_name,
        destination_station_name,
        segment_stop_count,
        passengers: passengers.map((p) => ({
          passenger_name: p.passenger_name.trim(),
          age: Number(p.age),
          gender: p.gender,
          berth_preference: p.berth_preference,
          seat_id: p.seat_id,
          seat_number: p.seat_number,
          coach_name: p.coach_name,
          berth_type: p.berth_type,
        })),
      },
    });
  };

  const getBerthLabel = (berthType) => {
    const map = { L: "Lower", M: "Middle", U: "Upper", SL: "Side Lower", SU: "Side Upper" };
    return map[berthType] || berthType;
  };

  const seatsSelected = passengers.filter((p) => p.seat_id).length;
  const allSeatsSelected = seatsSelected === passengers.length;
  const formattedDate = travel_date
    ? new Date(travel_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "N/A";

  return (
    <div className="ss-page">
      <header className="ss-header">
        <div className="ss-header-inner">
          <div className="ss-header-left">
            <div className="ss-train-badge">{location.state?.train_number || "N/A"}</div>
            <div className="ss-train-info">
              <h1 className="ss-train-name">{location.state?.train_name || "Train"}</h1>
              <div className="ss-route-strip" aria-label={`${source_station_code || "FROM"} to ${destination_station_code || "TO"}`}>
                <span>
                  <strong>{source_station_code || "FROM"}</strong>
                  {source_station_name && <em>{source_station_name}</em>}
                </span>
                <b>to</b>
                <span>
                  <strong>{destination_station_code || "TO"}</strong>
                  {destination_station_name && <em>{destination_station_name}</em>}
                </span>
              </div>
              <div className="ss-train-meta">
                <span>Date: {formattedDate}</span>
                <span className="ss-meta-sep">|</span>
                <span>Coach: {coach_name} - {coach_type}</span>
                <span className="ss-meta-sep">|</span>
                <span className={seatsSelected === passengers.length ? "ss-meta-done" : ""}>
                  Seats: {seatsSelected}/{passengers.length}
                </span>
              </div>
            </div>
          </div>
          <div className="ss-progress-ring-wrap">
            <svg className="ss-progress-ring" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" className="ss-ring-bg" />
              <circle
                cx="22"
                cy="22"
                r="18"
                className="ss-ring-fill"
                strokeDasharray={`${(seatsSelected / passengers.length) * 113} 113`}
              />
            </svg>
            <span className="ss-ring-label">{seatsSelected}/{passengers.length}</span>
          </div>
        </div>
      </header>

      <div className="ss-body">
        <section className="ss-coach-panel">
          <div className="ss-panel-head">
            <h2 className="ss-panel-title">Coach Layout</h2>
            <div className="ss-legend">
              <span className="ss-legend-dot ss-dot-available" />Available
              <span className="ss-legend-dot ss-dot-selected" />Selected
              <span className="ss-legend-dot ss-dot-booked" />Booked
            </div>
          </div>

          <div className="ss-coach-wrap">
            {loadingSeats ? (
              <div className="ss-coach-loading">
                <div className="ss-spinner" />
                <p>Loading seats</p>
              </div>
            ) : (
              <>
                {coach_type === "2A" && <A1Coach coachName={coach_name} seats={seats} passengers={passengers} assignSeat={assignSeat} />}
                {coach_type === "3A" && <B1Coach coachName={coach_name} seats={seats} passengers={passengers} assignSeat={assignSeat} />}
                {coach_type === "Sleeper" && <SleeperCoach coachName={coach_name} seats={seats} passengers={passengers} assignSeat={assignSeat} />}
              </>
            )}
          </div>

          <div className="ss-coach-notice">
            Coach position may vary by train. Verify at the station.
          </div>
        </section>

        <section className="ss-passenger-panel">
          <div className="ss-panel-head">
            <h2 className="ss-panel-title">Passenger Details</h2>
            <button className="ss-add-btn" onClick={addPassenger}  type="button">
              <span>+</span> Add Passenger
            </button>
          </div>

          <div className="ss-passenger-list">
            {passengers.map((p, index) => (
              <div
                key={index}
                className={`ss-pax-card ${activePassenger === index ? "ss-pax-active" : ""}`}
                onClick={() => setActivePassenger(index)}
              >
                <div className="ss-pax-bar">
                  <div className="ss-pax-bar-left">
                    <span className="ss-pax-num">Passenger {index + 1}</span>
                    {p.seat_number ? (
                      <span className="ss-seat-tag ss-seat-tag--filled">
                        {p.coach_name}-{p.seat_number}
                        {p.berth_type && <em> - {getBerthLabel(p.berth_type)}</em>}
                      </span>
                    ) : (
                      <span className="ss-seat-tag ss-seat-tag--empty">No seat</span>
                    )}
                  </div>
                  <div className="ss-pax-bar-right">
                    {p.seat_number && (
                      <button
                        className="ss-icon-btn ss-clear-btn"
                        title="Clear seat"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearSeatAssignment(index);
                        }}
                        type="button"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      className="ss-icon-btn ss-remove-btn"
                      title="Remove passenger"
                      disabled={passengers.length <= 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        removePassenger(index);
                      }}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="ss-pax-form">
                  <div className="ss-form-row">
                    <div className="ss-form-group ss-form-grow">
                      <label className="ss-label">Name <span className="ss-required">*</span></label>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={p.passenger_name}
                        className={`ss-input ${!p.passenger_name.trim() && activePassenger === index ? "ss-input--error" : ""}`}
                        onChange={(e) => {
                          const updated = [...passengers];
                          updated[index].passenger_name = e.target.value;
                          setPassengers(updated);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="ss-form-group ss-form-age">
                      <label className="ss-label">Age <span className="ss-required">*</span></label>
                      <input
                        type="number"
                        placeholder="-"
                        min="1"
                        max="120"
                        value={p.age}
                        className={`ss-input ${(!p.age || p.age < 1 || p.age > 120) && activePassenger === index ? "ss-input--error" : ""}`}
                        onChange={(e) => {
                          const updated = [...passengers];
                          updated[index].age = e.target.value;
                          setPassengers(updated);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="ss-form-row">
                    <div className="ss-form-group">
                      <label className="ss-label">Gender <span className="ss-required">*</span></label>
                      <select
                        className="ss-select"
                        value={p.gender}
                        onChange={(e) => {
                          const updated = [...passengers];
                          updated[index].gender = e.target.value;
                          setPassengers(updated);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Transgender">Transgender</option>
                      </select>
                    </div>
                  </div>
                  {!p.seat_id && activePassenger === index && (
                    <div className="ss-seat-hint">
                      Select a seat from the coach layout.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="ss-summary">
            <div className="ss-summary-stats">
              <div className="ss-stat">
                <span className="ss-stat-val">{passengers.length}</span>
                <span className="ss-stat-label">Passengers</span>
              </div>
              <div className="ss-stat-divider" />
              <div className="ss-stat">
                <span className="ss-stat-val ss-stat-val--green">{seatsSelected}</span>
                <span className="ss-stat-label">Selected</span>
              </div>
              <div className="ss-stat-divider" />
              <div className="ss-stat">
                <span className={`ss-stat-val ${passengers.length - seatsSelected > 0 ? "ss-stat-val--orange" : "ss-stat-val--green"}`}>
                  {passengers.length - seatsSelected}
                </span>
                <span className="ss-stat-label">Pending</span>
              </div>
            </div>
            <button
              className={`ss-proceed-btn ${allSeatsSelected ? "ss-proceed-btn--ready" : "ss-proceed-btn--waiting"}`}
              onClick={handleBooking}
              disabled={!allSeatsSelected}
              type="button"
            >
              {allSeatsSelected ? "Proceed to Payment" : "Select All Seats First"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SeatSelection;
