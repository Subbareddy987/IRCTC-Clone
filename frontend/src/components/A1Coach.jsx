import "./A1Coach.css";

function A1Coach({ coachName = "A1", seats, passengers, assignSeat }) {
  const isSelected = (seatId) =>
    passengers.some((p) => p.seat_id === seatId);

  const renderSeat = (seat) => {
    if (!seat) return null;

    return (
      <button
        type="button"
        className={`a1-seat
          ${seat.status !== "AVAILABLE" ? "booked" : ""}
          ${isSelected(seat.seat_id) ? "selected" : ""}
        `}
        onClick={() =>
          seat.status === "AVAILABLE" && assignSeat(seat)
        }
      >
        <div className="a1-seat-number">
          {seat.seat_number}
        </div>

        <div className="a1-seat-berth">
          {seat.berth_type}
        </div>
      </button>
    );
  };

  const bays = [];

  for (let i = 0; i < seats.length; i += 6) {
    bays.push(seats.slice(i, i + 6));
  }

  return (
    <div className="a1-wrapper">

      <div className="a1-header">
        <h2>{coachName} - AC 2 Tier</h2>

        <div className="a1-legend">
          <div>
            <span className="a1-dot available"></span>
            Available
          </div>

          <div>
            <span className="a1-dot booked"></span>
            Booked
          </div>

          <div>
            <span className="a1-dot selected"></span>
            Selected
          </div>
        </div>
      </div>

      

      <div className="a1-coach">

        {bays.map((bay, index) => (
          <div key={index} className="a1-bay">

            <div className="a1-main-block">

              <div className="a1-seat-row">
                {renderSeat(bay[0])}
                {renderSeat(bay[1])}
              </div>

              <div className="a1-seat-row">
                {renderSeat(bay[2])}
                {renderSeat(bay[3])}
              </div>

            </div>

            <div className="a1-aisle"></div>

            <div className="a1-side-block">
              {renderSeat(bay[4])}
              {renderSeat(bay[5])}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default A1Coach;
