import "./B1Coach.css";

function B1Coach({ coachName = "B1", seats = [], passengers = [], assignSeat }) {
  const selectedSeatIds = new Set(
    passengers.map((passenger) => passenger.seat_id),
  );

  const isSelected = (seatId) => selectedSeatIds.has(seatId);

  const getSeatClassName = (seat) => {
    const classes = ["rail-seat"];

    if (seat.status !== "AVAILABLE") classes.push("booked");
    if (isSelected(seat.seat_id)) classes.push("selected");

    return classes.join(" ");
  };

  const renderSeat = (seat) => {
    if (!seat) return <div className="seat-placeholder" />;

    const isAvailable = seat.status === "AVAILABLE";

    return (
      <button
        key={seat.seat_id}
        type="button"
        className={getSeatClassName(seat)}
        disabled={!isAvailable}
        onClick={() => isAvailable && assignSeat(seat)}
      >
        <span className="seat-number">{seat.seat_number}</span>

        <span className="seat-berth">{seat.berth_type}</span>

        {!isAvailable && (
          <span className="booked-label">BOOKED</span>
        )}
      </button>
    );
  };

  const bays = [];

  for (let index = 0; index < seats.length; index += 8) {
    bays.push(seats.slice(index, index + 8));
  }

  return (
    <section className="coach-wrapper">
      <header className="coach-header">
        <div>
          <h2>{coachName} - AC 3 Tier</h2>
        </div>

        <div className="coach-legend">
          <div>
            <span className="dot available" />
            Available
          </div>

          <div>
            <span className="dot booked" />
            Booked
          </div>

          <div>
            <span className="dot selected" />
            Selected
          </div>
        </div>
      </header>

      

      <div className="coach-warning">
        WARNING! Coach position may not be accurate for certain trains.
        Please check it once at station
      </div>

      <div className="railway-coach">
        {bays.map((bay, index) => (
          <div key={index} className="coach-bay">
            <div className="main-block">
              <div className="seat-row">
                {renderSeat(bay[0])}
                {renderSeat(bay[1])}
                {renderSeat(bay[2])}
              </div>

              <div className="seat-row">
                {renderSeat(bay[3])}
                {renderSeat(bay[4])}
                {renderSeat(bay[5])}
              </div>
            </div>

            <div className="aisle-space" />

            <div className="side-block">
              {renderSeat(bay[6])}
              {renderSeat(bay[7])}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default B1Coach;
