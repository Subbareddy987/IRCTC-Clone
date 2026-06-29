import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getTraindetails } from "../services/autoService";
import "./TrainDetails.css";

const stationImages = {
  NRT: {
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&q=80",
    place: "Narasaraopet Town Stop",
    desc: "A Palnadu region stop known for education, markets and road links into nearby rural communities.",
    highlight: "Town Stop",
  },
  DKD: {
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=700&q=80",
    place: "Donakonda Rail Halt",
    desc: "A quiet Prakasam district halt serving local passengers and connecting interior towns along the route.",
    highlight: "Passenger Halt",
  },
  SC: {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80",
    place: "Modern Express Service",
    desc: "A premium long-distance rail stop with fast connections across the southern network.",
    highlight: "Express Stop",
  },
  GNT: {
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=700&q=80",
    place: "Guntur Rail Junction",
    desc: "World-famous red chilli market — the spice capital of Andhra Pradesh.",
    highlight: "Junction",
  },
  OGL: {
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=700&q=80",
    place: "Mainline Passenger Halt",
    desc: "Home of the internationally acclaimed Ongole breed — prized for strength and endurance.",
    highlight: "Mainline",
  },
  NLR: {
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=700&q=80",
    place: "Platform Transfer Point",
    desc: "Beautiful coastline dotted with fishing hamlets, temples and fresh seafood culture.",
    highlight: "Platform",
  },
  GDR: {
    image: "https://images.unsplash.com/photo-1535535112387-56ffe8db21ff?w=700&q=80",
    place: "Classic Indian Rail Stop",
    desc: "One of the largest mango auction hubs in South India during the summer harvest.",
    highlight: "Rail Link",
  },
  MAS: {
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=700&q=80",
    place: "Metropolitan Terminal",
    desc: "The world's second-longest urban beach — the soul of Chennai for generations.",
    highlight: "Terminal",
  },
  BZA: {
    image: "https://images.unsplash.com/photo-1507226983735-a838615193b0?w=700&q=80",
    place: "High-Traffic Rail Hub",
    desc: "Vijayawada sits at the lush Krishna delta, gateway to Amaravati and ancient temples.",
    highlight: "Rail Hub",
  },
  VSKP: {
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700&q=80",
    place: "Coastal Express Corridor",
    desc: "Visakhapatnam's gem — serene bay backed by the Eastern Ghats range.",
    highlight: "Express",
  },
  NDLS: {
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&q=80",
    place: "Capital Rail Terminal",
    desc: "UNESCO World Heritage Site — the majestic Mughal fortification at the heart of Delhi.",
    highlight: "Capital Terminal",
  },
  HWH: {
    image: "https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=700&q=80",
    place: "Heritage Rail Gateway",
    desc: "Iconic cantilever bridge over the Hooghly — a living symbol of Kolkata.",
    highlight: "Heritage Rail",
  },
};

const defaultPlace = {
  image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=700&q=80",
  place: "Railway Station",
  desc: "An important stop connecting communities and commerce along this route.",
  highlight: "En Route",
};

function TrainDetails() {
  const { train_id } = useParams();
  const [searchParams] = useSearchParams();
  const sourceCode = searchParams.get("source");
  const destinationCode = searchParams.get("destination");
  const travelDate = searchParams.get("date") || "";
  const preferredClass = searchParams.get("class") || "";
  const [train, setTrain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTrain() {
      try {
        const response = await getTraindetails(train_id, sourceCode, destinationCode);
        setTrain(response.data);
      } catch (error) {
        console.error(error);
        setError("We could not load this journey segment. Please search again.");
      } finally {
        setLoading(false);
      }
    }
    loadTrain();
  }, [train_id, sourceCode, destinationCode]);

  if (loading) {
    return (
      <div className="td-loading">
        <div className="td-loading-track">
          <div className="td-loading-train">🚂</div>
          <div className="td-loading-rail" />
        </div>
        <p>Loading route details…</p>
      </div>
    );
  }

  if (train.length === 0) {
    return (
      <div className="td-loading">
        <p>{error || "No route data found for the selected journey."}</p>
        <button className="td-avail-btn" onClick={() => navigate("/trains/search")}>Search Again</button>
      </div>
    );
  }

  const traininfo = train[0];
  const lastStation = train[train.length - 1];
  const totalStops = train.length;
  const segmentStopCount = Math.max(totalStops - 1, 0);

  return (
    <div className="td-page">
      {/* ── Banner ── */}
      <header className="td-banner">
        <div className="td-banner-overlay" />
        <div className="td-banner-grid" />
        <div className="td-banner-inner">
          <span className="td-eyebrow">Indian Railways</span>
          <div className="td-train-number">
            <span className="td-hash">#</span>
            {traininfo.train_number}
          </div>
          <h1 className="td-train-name">{traininfo.train_name}</h1>
          <div className="td-meta-row">
            <span className="td-meta-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {segmentStopCount} {segmentStopCount === 1 ? "Stop" : "Stops"}
            </span>
            <span className="td-meta-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="11" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {traininfo.station_name} ({traininfo.station_code}) → {lastStation.station_name} ({lastStation.station_code})
            </span>
          </div>
          <button
            className="td-avail-btn"
            onClick={() =>
              navigate(`/availability/${train_id}?${new URLSearchParams({
                source: String(traininfo.station_id),
                destination: String(lastStation.station_id),
                sourceCode: traininfo.station_code,
                destinationCode: lastStation.station_code,
                sourceName: traininfo.station_name,
                destinationName: lastStation.station_name,
                date: travelDate,
                class: preferredClass,
                stops: String(segmentStopCount),
              }).toString()}`)
            }
          >
            Check Seat Availability
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        {/* Animated sparks */}
        <div className="td-sparks">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`td-spark td-spark-${i + 1}`} />
          ))}
        </div>
      </header>

      {/* ── Route Section ── */}
      <section className="td-route-section">
        <div className="td-route-header">
          <h2>Journey Route</h2>
          <p>Showing only your journey from {traininfo.station_name} to {lastStation.station_name}</p>
        </div>

        {/* Railway Track Timeline */}
        <div className="td-timeline">
          {/* Central track structure */}
          <div className="td-track-spine">
            <div className="td-rail td-rail-left" />
            <div className="td-rail td-rail-right" />
            {/* Sleepers (crossties) */}
            {[...Array(Math.max(totalStops * 4, 16))].map((_, i) => (
              <div key={i} className="td-sleeper" style={{ top: `${(i / (Math.max(totalStops * 4, 16) - 1)) * 100}%` }} />
            ))}
            {/* End buffer */}
            <div className="td-buffer-end">
              <div className="td-buffer-bar" />
              <div className="td-buffer-bar" />
            </div>
          </div>

          {/* Stops */}
          <div className="td-stops">
            {train.map((station, idx) => {
              const place = stationImages[station.station_code] || defaultPlace;
              const isFirst = idx === 0;
              const isLast = idx === train.length - 1;
              const side = idx % 2 === 0 ? "left" : "right";

              return (
                <div
                  key={station.stop_order}
                  className={`td-stop td-stop-${side}`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* Station dot on track */}
                  <div className={`td-station-dot ${isFirst ? "td-dot-first" : isLast ? "td-dot-last" : ""}`}>
                    {isFirst && <span className="td-dot-label">START</span>}
                    {isLast && <span className="td-dot-label td-dot-label-end">END</span>}
                    <div className="td-dot-pulse" />
                  </div>

                  {/* Platform connector arm */}
                  <div className="td-arm" />

                  {/* Station Card */}
                  <div className="td-card">
                    <div className="td-card-img-wrap">
                      <img
                        src={place.image}
                        alt={station.station_name}
                        className="td-card-img"
                        loading="lazy"
                        onError={(e) => { e.target.src = defaultPlace.image; }}
                      />
                      <div className="td-card-img-overlay" />
                      <span className="td-stop-number">Stop {station.stop_order}</span>
                      <span className="td-highlight-badge">{place.highlight}</span>
                    </div>
                    <div className="td-card-body">
                      <div className="td-station-code-row">
                        <span className="td-station-code">{station.station_code}</span>
                        {isFirst && <span className="td-terminal-tag origin">Origin</span>}
                        {isLast && <span className="td-terminal-tag dest">Destination</span>}
                      </div>
                      <h3 className="td-station-name">{station.station_name}</h3>
                      <h4 className="td-place-name">{place.place}</h4>
                      <p className="td-place-desc">{place.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default TrainDetails;
