import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getStations, searchTrains } from "../services/autoService";
import "./SearchTrain.css";
import { toast } from "react-toastify";

function filterStations(query, stations = []) {
  
  if (!query || query.length < 1) return [];

  const q = query.toLowerCase();

  return stations
    .filter(
      (s) =>
        s.station_name.toLowerCase().includes(q) ||
        s.station_code.toLowerCase().includes(q)
    )
    .slice(0, 8)
    .map((s) => ({
      code: s.station_code,
      name: s.station_name,
    }));
}

function normalizeStationText(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

const stationAliases = {
  bangalore: ["bengaluru", "ksr bengaluru", "sbc"],
  bengaluru: ["bangalore", "ksr bengaluru", "sbc"],
  chennai: ["mgr chennai central", "chennai central", "mas"],
  delhi: ["new delhi", "ndls"],
  hyderabad: ["hyderabad deccan", "secunderabad", "hyb", "sc"],
  mumbai: ["mumbai cst", "mumbai central", "csmt"],
};

function findStationFromQuery(query, stations = []) {
  if (!query) return { code: "", name: "" };

  const normalizedQuery = normalizeStationText(query);
  const queryCandidates = [
    normalizedQuery,
    ...(stationAliases[normalizedQuery] || []).map(normalizeStationText),
  ];
  const exactMatch = stations.find(
    (station) =>
      queryCandidates.includes(normalizeStationText(station.station_code)) ||
      queryCandidates.includes(normalizeStationText(station.station_name)),
  );

  if (exactMatch) {
    return {
      code: exactMatch.station_code,
      name: exactMatch.station_name,
    };
  }

  const partialMatch = stations.find(
    (station) =>
      queryCandidates.some((candidate) =>
        normalizeStationText(station.station_name).includes(candidate),
      ) ||
      queryCandidates.some((candidate) =>
        candidate.includes(normalizeStationText(station.station_code)),
      ),
  );

  if (partialMatch) {
    return {
      code: partialMatch.station_code,
      name: partialMatch.station_name,
    };
  }

  return {
    code: "",
    name: query,
  };
}

function StationInput({ label, value, onChange, placeholder,stations }) {
  const [query, setQuery] = useState(value?.name || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    const results = filterStations(val,stations);
    setSuggestions(results);
    setOpen(results.length > 0);
    // Clear selection if user is typing
    onChange({ code: "", name: val });
  };

  const handleSelect = (station) => {
    setQuery(station.name);
    onChange(station);
    setOpen(false);
  };

  return (
    <div className="st-input-wrap" ref={wrapperRef}>
      <label className="st-label">{label}</label>
      <div className="st-field">
        <span className="st-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </span>
        <input
          className="st-input"
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInput}
          onFocus={() => {
            const results = filterStations(query,stations);
            if (results.length > 0) setOpen(true);
          }}
          autoComplete="off"
        />
        {value?.code && <span className="st-code-badge">{value.code}</span>}
      </div>
      {open && (
        <ul className="st-dropdown">
          {suggestions.map((s) => (
            <li key={s.code} className="st-option" onMouseDown={() => handleSelect(s)}>
              <span className="st-option-name">{s.name}</span>
              <span className="st-option-code">{s.code}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatTrainTime(time) {
  if (!time) return "N/A";

  const [hours = "00", minutes = "00"] = String(time).split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function Searchtrain() {
  const [source, setSource] = useState({ code: "", name: "" });
  const [destination, setDestination] = useState({ code: "", name: "" });
  const [journeyDate, setJourneyDate] = useState("");
  const [coachType] = useState("Sleeper");
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
   useEffect(() => {
  async function loadStations() {
    try {
      const data = await getStations();
      setStations(data.stations);
    } catch (error) {
      console.log(error);
    }
  }

  loadStations();
}, []);

  useEffect(() => {
    if (!stations.length) return;

    const sourceQuery = searchParams.get("from") || searchParams.get("source");
    const destinationQuery =
      searchParams.get("to") || searchParams.get("destination");
    const dateQuery = searchParams.get("date");

    const prefillTimer = window.setTimeout(() => {
      if (sourceQuery) {
        setSource(findStationFromQuery(sourceQuery, stations));
      }

      if (destinationQuery) {
        setDestination(findStationFromQuery(destinationQuery, stations));
      }

      if (dateQuery) {
        setJourneyDate(dateQuery);
      }
    }, 0);

    return () => window.clearTimeout(prefillTimer);
  }, [searchParams, stations]);
  const swapStations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!source.code || !destination.code) {
      toast.error("Please select valid stations from the suggestions.");
      return;
    }
    setLoading(true);
    try {
      const response = await searchTrains(source.code, destination.code);
      setTrains(response.train);
      if (!response.train?.length) {
        toast.info("No trains found for this route.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to search trains");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-overlay" />
          <div className="moving-track">
            <div className="track-line" />
            <div className="train-silhouette">🚂</div>
          </div>
        </div>

        <div className="hero-inner">
          <div className="hero-text">
            <span className="hero-eyebrow">भारतीय रेलवे</span>
            <h1 className="hero-title">
              India's Rail
              <span className="hero-accent"> Network</span>
            </h1>
            <p className="hero-sub">
              Search trains, check live availability &amp; book your journey across India.
            </p>
          </div>

          {/* Booking Card */}
          <form className="booking-card" onSubmit={handleSearch}>
            <div className="card-header">
              <span className="card-dot" />
              Plan Your Journey
            </div>

            <div className="station-row">
              <StationInput
                key={`source-${source.code}-${source.name}`}
                label="From"
                value={source}
                onChange={setSource}
                placeholder="Departure station"
                 stations={stations}
              />

              <button
                type="button"
                className="swap-btn"
                onClick={swapStations}
                title="Swap stations"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <StationInput
                key={`destination-${destination.code}-${destination.name}`}
                label="To"
                value={destination}
                onChange={setDestination}
                placeholder="Arrival station"
                 stations={stations}
              />
            </div>

            <div className="options-row">
              <div className="opt-group">
                <label className="opt-label">Journey Date</label>
                <div className="opt-field">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opt-icon">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <input
                    type="date"
                    className="opt-input"
                    value={journeyDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              
            </div>

            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loader">
                  <span className="spinner" /> Searching…
                </span>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Search Trains
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      {trains.length > 0 && (
        <section className="results">
          <div className="results-inner">
            <div className="results-header">
              <h2 className="results-title">
                <span className="results-count">{trains.length}</span> Trains Found
              </h2>
              <p className="results-route">
                {source.name || source.code} → {destination.name || destination.code}
              </p>
            </div>

            <div className="train-list">
              {trains.map((train, idx) => (
                <div
                  key={train.train_id}
                  className="train-card"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="train-number-badge">{train.train_number}</div>
                  <div className="train-info">
                    <h3 className="train-name">{train.train_name}</h3>
                    <div className="train-route-row">
                      <span className="route-station">{source.code || source.name}</span>
                      <span className="route-arrow">
                        <svg width="60" height="12" viewBox="0 0 60 12">
                          <line x1="0" y1="6" x2="50" y2="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
                          <polygon points="50,2 60,6 50,10" fill="currentColor" />
                        </svg>
                      </span>
                      <span className="route-station">{destination.code || destination.name}</span>
                    </div>
                    <div className="train-time-row" aria-label="Train timings">
                      <div className="train-time">
                        <span>Departure</span>
                        <strong>{formatTrainTime(train.selected_departure_time)}</strong>
                      </div>
                      <div className="train-time-divider" />
                      <div className="train-time">
                        <span>Arrival</span>
                        <strong>{formatTrainTime(train.selected_arrival_time)}</strong>
                      </div>
                    </div>
                    <div className="train-tags">
                      <span className="tag">{coachType}</span>
                      {journeyDate && (
                        <span className="tag tag-date">{new Date(journeyDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                      )}
                    </div>
                  </div>
                  <button
                    className="details-btn"
                    onClick={() => {
                      const params = new URLSearchParams({
                        source: source.code,
                        destination: destination.code,
                        date: journeyDate,
                        class: coachType,
                      });
                      navigate(`/traindata/${train.train_id}?${params.toString()}`);
                    }}
                  >
                    View Details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Searchtrain;
