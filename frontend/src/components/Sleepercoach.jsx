import "./Sleepercoach.css";

function SleeperCoach({ coachName = "S1", seats = [], passengers = [], assignSeat, reservingSeatId = null }) {
  const selectedSeatIds = new Set(
    passengers.map((passenger) => passenger.seat_id)
  );

  const isSelected = (seatId) => selectedSeatIds.has(seatId);

  const getSeatClassName = (seat) => {
    const classes = ["rail-seat"];
    const selected = isSelected(seat.seat_id);
    const reserving = reservingSeatId === seat.seat_id;
    const isUnavailable = seat.status === "BOOKED" || (seat.status === "LOCKED" && !selected);

    if (isUnavailable && !selected) classes.push("booked");
    if (selected) classes.push("selected");
    if (reserving) classes.push("reserving");

    return classes.join(" ");
  };

  const renderSeat = (seat) => {
    if (!seat) return <div className="seat-placeholder" />;

    const selected = isSelected(seat.seat_id);
    const reserving = reservingSeatId === seat.seat_id;
    const isUnavailable = seat.status === "BOOKED" || (seat.status === "LOCKED" && !selected);
    const isDisabled = (isUnavailable && !selected) || Boolean(reservingSeatId);

    return (
      <button
        key={seat.seat_id}
        type="button"
        className={getSeatClassName(seat)}
        disabled={isDisabled}
        onClick={() => (!isUnavailable || selected) && assignSeat(seat)}
      >
        <span className="seat-number">{seat.seat_number}</span>
        <span className="seat-berth">{reserving ? "WAIT" : seat.berth_type}</span>
      </button>
    );
  };

  const bays = [];

  for (let i = 0; i < seats.length; i += 8) {
    bays.push(seats.slice(i, i + 8));
  }

  return (
    <section className="coach-wrapper">
      <header className="coach-header">
        <h2>{coachName} - Sleeper Coach</h2>

        <div className="coach-legend">
          <div>
            <span className="dot available" />
            Available
          </div>

          <div>
            <span className="dot selected" />
            Selected
          </div>

          <div>
            <span className="dot reserving" />
            Reserving
          </div>

          <div>
            <span className="dot booked" />
            Booked
          </div>
        </div>
      </header>

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

export default SleeperCoach;
