import pool from "../config/db.js";
export const createBooking = async (
  user_id,
  train_id,
  source_station_id,
  destination_station_id,
  travel_date,
  pnr,
  passengers,
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const bookingQuery = `INSERT INTO bookings(pnr_number,
                            user_id,train_id,source_station_id,destination_station_id
                            ,travel_date,total_passengers,booking_status)
                            VALUES($1,$2,$3,$4,$5,$6,$7,$8)
                            RETURNING *;`;
    const bookingResult = await client.query(bookingQuery, [
      pnr,
      user_id,
      train_id,
      source_station_id,
      destination_station_id,
      travel_date,
      passengers.length,
      "CONFIRMED",
    ]);
    const bookings = bookingResult.rows[0];
    for (const passenger of passengers) {
      const seatCheck = await client.query(
        `SELECT 1 FROM booked_seats WHERE seat_id=$1 AND train_id=$2 AND travel_date=$3`,
        [passenger.seat_id, train_id, travel_date],
      );
      if (seatCheck.rows.length > 0) {
        throw new Error(`Seat ${passenger.seat_id} already booked`);
      }
      const passengerQuery = `INSERT INTO passengers(booking_id,passenger_name,age,gender,seat_id)
                                  VALUES($1,$2,$3,$4,$5)
                                  RETURNING *;`;
      const passengerResult = await client.query(passengerQuery, [
        bookings.booking_id,
        passenger.passenger_name,
        passenger.age,
        passenger.gender,
        passenger.seat_id,
      ]);
      const bookedseatquery = `INSERT INTO booked_seats(seat_id,train_id,travel_date,booking_id)
                               VALUES($1,$2,$3,$4)
                               RETURNING *;`;
      const seatResult = await client.query(bookedseatquery, [
        passenger.seat_id,
        train_id,
        travel_date,
        bookings.booking_id,
      ]);
    }

    await client.query("COMMIT");
    return bookings;
  } catch (error) {
    // console.error(error)
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
export const getSeatsByTrain = async (train_id, travel_date, coach_name) => {
  const query = `
    SELECT
      s.seat_id,
      s.seat_number,
      s.berth_type,
      c.coach_name,
    CASE
        WHEN bs.seat_id IS NOT NULL
        THEN 'BOOKED'
        ELSE 'AVAILABLE'
    END AS status
    FROM seats s
    JOIN coaches c
    ON s.coach_id = c.coach_id
    LEFT JOIN booked_seats bs
    ON s.seat_id = bs.seat_id
    AND bs.train_id = $1
    AND bs.travel_date = $2
    WHERE c.train_id = $1
    AND c.coach_name = $3
    ORDER BY s.seat_number;`;
  const result = await pool.query(query, [train_id, travel_date,coach_name]);
  return result.rows;
};
export const getMyBookings = async (user_id) => {
  const query = `
    SELECT b.booking_id,b.pnr_number,t.train_number,t.train_name,
        s1.station_name AS source_station,
        s2.station_name AS destination_station,
        b.travel_date,
        b.booking_status
    FROM bookings b
    JOIN trains t
        ON b.train_id = t.train_id
    JOIN stations s1
        ON b.source_station_id = s1.station_id
    JOIN stations s2
        ON b.destination_station_id = s2.station_id
    WHERE b.user_id = $1
    ORDER BY b.booking_date DESC;`;
  const result = await pool.query(query, [user_id]);
  return result.rows;
};
export const getBookingDetails = async (booking_id) => {
  const query = `SELECT b.booking_id,b.pnr_number,b.travel_date,b.booking_status,
                t.train_number,t.train_name,
                src.station_name AS source_station_name,
                src.station_code AS source_station_code,
                dest.station_name AS destination_station_name,
                dest.station_code AS destination_station_code,
                p.passenger_name,p.age,p.gender,
                s.seat_number,s.berth_type,
                c.coach_name
                FROM bookings b
                JOIN trains t
                ON b.train_id=t.train_id
                JOIN stations src
                ON b.source_station_id=src.station_id
                JOIN stations dest
                ON b.destination_station_id=dest.station_id
                JOIN passengers p
                ON b.booking_id=p.booking_id
                JOIN seats s
                ON p.seat_id=s.seat_id
                JOIN coaches c
                ON s.coach_id=c.coach_id
                WHERE b.booking_id=$1;`;
  const result = await pool.query(query, [booking_id]);
  return result.rows;
};
export const getBookingbyPNR = async (pnr_number) => {
  const query = `SELECT b.booking_id,b.pnr_number,b.travel_date,b.booking_status,
                t.train_number,t.train_name,
                src.station_name AS source_station_name,
                src.station_code AS source_station_code,
                dest.station_name AS destination_station_name,
                dest.station_code AS destination_station_code,
                p.passenger_name,p.age,p.gender,
                s.seat_number,s.berth_type,
                c.coach_name
                FROM bookings b
                JOIN trains t
                ON b.train_id=t.train_id
                JOIN stations src
                ON b.source_station_id=src.station_id
                JOIN stations dest
                ON b.destination_station_id=dest.station_id
                JOIN passengers p
                ON b.booking_id=p.booking_id
                JOIN seats s
                ON p.seat_id=s.seat_id
                JOIN coaches c
                ON s.coach_id=c.coach_id
                WHERE b.pnr_number=$1;`;
  const result = await pool.query(query, [pnr_number]);
  return result.rows;
};
export const bookingCancel = async (booking_id, user_id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const bookingcheck = await client.query(
      `SELECT * FROM bookings WHERE booking_id=$1 AND user_id = $2;`,
      [booking_id, user_id],
    );
    if (bookingcheck.rows.length === 0) {
      throw new Error("Booking not found");
    }
    if (bookingcheck.rows[0].booking_status === "CANCELLED") {
      throw new Error("BookingSeat already Cancelled");
    }
    await client.query(
      `UPDATE bookings SET booking_status='CANCELLED' WHERE booking_id=$1`,
      [booking_id],
    );
    await client.query(`DELETE FROM booked_seats WHERE booking_id=$1`, [
      booking_id,
    ]);
    await client.query("COMMIT");
    return {
      message: "Booking Cancelled",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
