import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { checkAvailability, getTrainCoaches } from "../services/autoService";
import "./Availability.css";

function Availability() {
  const { train_id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const journey = {
    sourceId: searchParams.get("source"),
    destinationId: searchParams.get("destination"),
    sourceCode: searchParams.get("sourceCode") || "FROM",
    destinationCode: searchParams.get("destinationCode") || "TO",
    sourceName: searchParams.get("sourceName") || "Source station",
    destinationName: searchParams.get("destinationName") || "Destination station",
    stops: searchParams.get("stops") || "0",
  };

  const preferredClass = searchParams.get("class") || "";
  const hasSearchDate = Boolean(searchParams.get("date"));
  const [travelDate, setTravelDate] = useState(searchParams.get("date") || "");
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loadingCoaches, setLoadingCoaches] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCoaches() {
      try {
        const response = await getTrainCoaches(train_id);
        const coachList = response.coaches || [];
        setCoaches(coachList);
        setSelectedCoach(
          coachList.find((coach) => coach.coach_type === preferredClass) ||
            coachList[0] ||
            null,
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to load coaches for this train");
      } finally {
        setLoadingCoaches(false);
      }
    }

    loadCoaches();
  }, [train_id, preferredClass]);

  useEffect(() => {
    async function loadAvailability() {
      if (!travelDate || !selectedCoach) return;

      setLoading(true);
      try {
        const response = await checkAvailability(train_id, travelDate, selectedCoach.coach_name);
        setAvailability(response.data);
      } catch (error) {
        console.error(error);
        setAvailability(null);
        toast.error(error.response?.data?.message || "Failed to fetch availability");
      } finally {
        setLoading(false);
      }
    }

    loadAvailability();
  }, [train_id, travelDate, selectedCoach]);

  const selectCoach = (coach) => {
    setSelectedCoach(coach);
    setAvailability(null);
  };

  const totalSeats = Number(availability?.total_seats || 0);
  const availableSeats = Number(availability?.available_seats || 0);
  const bookedSeats = Number(availability?.booked_seats || 0);
  const availPercent = totalSeats ? Math.round((availableSeats / totalSeats) * 100) : 0;
  const statusColor = availPercent > 50 ? "good" : availPercent > 20 ? "mid" : "low";
  const journeyDateLabel = travelDate
    ? new Date(travelDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Select date";

  const continueToSeats = () => {
    if (!journey.sourceId || !journey.destinationId) {
      toast.error("Journey source and destination are missing. Please search again.");
      return;
    }

    if (!availability || !selectedCoach || !travelDate) {
      toast.error("Please complete coach availability before selecting seats.");
      return;
    }

    const params = new URLSearchParams({
      date: travelDate,
      coachName: selectedCoach.coach_name,
      coachType: selectedCoach.coach_type,
      source: journey.sourceId,
      destination: journey.destinationId,
      sourceCode: journey.sourceCode,
      destinationCode: journey.destinationCode,
      sourceName: journey.sourceName,
      destinationName: journey.destinationName,
      stops: journey.stops,
    });

    navigate(`/seats/${train_id}?${params.toString()}`, {
      state: {
        train_number: availability.train_number,
        train_name: availability.train_name,
      },
    });
  };

  return (
    <div className="av-page">
      <header className="av-hero">
        <div className="av-hero-glow" />
        <div className="av-hero-inner">
          <p className="av-eyebrow">Your Journey</p>
          <h1 className="av-title">Choose Your Coach</h1>
          <p className="av-sub">Pick a specific coach and continue straight to seat selection.</p>
        </div>
      </header>

      <main className="av-body">
        <div className="av-progress" aria-label="Booking progress">
          <span className="av-progress-step av-progress-done">Route</span>
          <span className="av-progress-line" />
          <span className="av-progress-step av-progress-active">Coach</span>
          <span className="av-progress-line" />
          <span className="av-progress-step">Seats</span>
          <span className="av-progress-line" />
          <span className="av-progress-step">Payment</span>
        </div>

        <section className="av-ticket" aria-label={`${journey.sourceName} to ${journey.destinationName}`}>
          <div className="av-ticket-station">
            <span className="av-ticket-code">{journey.sourceCode}</span>
            <span className="av-ticket-label">{journey.sourceName}</span>
          </div>
          <div className="av-ticket-mid">
            <span className="av-ticket-dot" />
            <span className="av-ticket-line">to</span>
            <span className="av-ticket-dot" />
          </div>
          <div className="av-ticket-station av-ticket-station-right">
            <span className="av-ticket-code">{journey.destinationCode}</span>
            <span className="av-ticket-label">{journey.destinationName}</span>
          </div>
          <span className="av-notch av-notch-l" />
          <span className="av-notch av-notch-r" />
        </section>

        <section className="av-form-card" aria-label="Coach selection">
          {hasSearchDate ? (
            <div className="av-date-summary">
              <span className="av-date-label">Journey Date</span>
              <strong>{journeyDateLabel}</strong>
            </div>
          ) : (
            <div className="av-field-wrap">
              <label className="av-label" htmlFor="journey-date">Journey Date</label>
              <input
                id="journey-date"
                className="av-input"
                type="date"
                value={travelDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(event) => {
                  setTravelDate(event.target.value);
                  setAvailability(null);
                }}
              />
            </div>
          )}

          <fieldset className="av-field-wrap av-coach-fieldset">
            <legend className="av-label">Coach Name</legend>
            {loadingCoaches ? (
              <div className="av-coach-loading"><span className="av-spinner" /> Loading coaches</div>
            ) : coaches.length ? (
              <div className="av-coach-grid">
                {coaches.map((coach) => (
                  <button
                    key={coach.coach_id}
                    className={`av-coach-btn ${selectedCoach?.coach_id === coach.coach_id ? "av-coach-active" : ""}`}
                    onClick={() => selectCoach(coach)}
                    type="button"
                    aria-pressed={selectedCoach?.coach_id === coach.coach_id}
                  >
                    <span className="av-coach-short">{coach.coach_name}</span>
                    <span className="av-coach-name">{coach.coach_type} - {coach.total_seats} seats</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="av-coach-empty">No coaches are configured for this train.</p>
            )}
          </fieldset>

          {loading && (
            <div className="av-inline-status">
              <span className="av-spinner" />
              Checking {selectedCoach?.coach_name || "coach"} availability
            </div>
          )}
        </section>

        {availability && (
          <section className="av-result-card" aria-label="Availability result">
            <div className="av-result-head">
              <div>
                <p className="av-result-train-number">#{availability.train_number} - {availability.coach_type}</p>
                <h2 className="av-result-train-name">Coach {availability.coach_name}</h2>
              </div>
              <span className={`av-status-badge av-status-${statusColor}`}>
                {availableSeats > 0 ? "Available" : "Full"}
              </span>
            </div>

            <div className="av-bar-wrap">
              <div className="av-bar-track">
                <div className={`av-bar-fill av-bar-${statusColor}`} style={{ width: `${availPercent}%` }} />
              </div>
              <span className="av-bar-label">{availPercent}% seats free</span>
            </div>

            <div className="av-stats-grid">
              <div className="av-stat"><span className="av-stat-num">{totalSeats}</span><span className="av-stat-label">Total</span></div>
              <div className="av-stat"><span className="av-stat-num av-stat-booked">{bookedSeats}</span><span className="av-stat-label">Booked</span></div>
              <div className="av-stat"><span className={`av-stat-num av-avail-${statusColor}`}>{availableSeats}</span><span className="av-stat-label">Available</span></div>
            </div>

            <div className="av-meta-strip">
              <div className="av-meta-item"><span>Date</span><strong>{journeyDateLabel}</strong></div>
              <div className="av-meta-item"><span>Coach</span><strong>{availability.coach_name} - {availability.coach_type}</strong></div>
              <div className="av-meta-item"><span>Route</span><strong>{journey.sourceCode} - {journey.destinationCode}</strong></div>
            </div>

            <button className="av-continue-btn" type="button" onClick={continueToSeats} disabled={availableSeats === 0}>
              Select Seats in {availability.coach_name}
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default Availability;
