import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingByPNR } from "../services/autoService";
import { toast } from "react-toastify";
import "./SearchPNR.css";

function SearchPNR() {
  const [pnr, setPnr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!pnr.trim()) {
      return toast("Please enter a PNR Number");
    }

    try {
      setLoading(true);

      const response = await getBookingByPNR(pnr);

      const bookingId = response.booking[0].booking_id;

      navigate(`/booking/${bookingId}`);
    } catch (error) {
      console.error(error);

      toast("PNR Not Found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pnr-page">
      <div className="pnr-container">
        <div className="pnr-card">
          <h1>PNR Status Enquiry</h1>

          <p>
            Enter your PNR number below to check ticket details and booking
            status.
          </p>

          <div className="pnr-input-group">
            <input
              type="text"
              placeholder="Enter 10 Digit PNR Number"
              value={pnr}
              onChange={(e) => setPnr(e.target.value)}
            />
          </div>

          <button
            className="pnr-search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Check PNR Status"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchPNR;