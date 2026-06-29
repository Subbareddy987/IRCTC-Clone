import pool from "../config/db.js";
export const getalltrains = async () => {
  const query = `SELECT * FROM trains ORDER BY train_id;`;
  const result = await pool.query(query);
  return result.rows;
};
export const CreateTrain = async (
  train_number,
  train_name,
  source_station_id,
  destination_station_id,
  departure_time,
  arrival_time,
  total_distance,
) => {
  const query = `INSERT INTO trains(train_number,train_name,source_station_id,destination_station_id,
                                    departure_time,arrival_time,total_distance)
                                    VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
  const result = await pool.query(query, [
    train_number,
    train_name,
    source_station_id,
    destination_station_id,
    departure_time,
    arrival_time,
    total_distance,
  ]);
  return result.rows[0];
};
export const UpdateTrain = async (train_id, updates) => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const dynamic_part = fields
    .map((field, index) => `${field}=$${index + 1}`)
    .join(",");
  const query = `UPDATE trains SET ${dynamic_part} WHERE train_id=$${fields.length + 1} RETURNING *;`;
  const result = await pool.query(query, [...values, train_id]);
  return result.rows[0];
};
export const DeleteTrain = async (train_id) => {
  const query = `DELETE FROM trains WHERE train_id=$1 RETURNING *;`;
  const result = await pool.query(query, [train_id]);
  return result.rows[0];
};
export const searchTrains = async (Scode, Dcode) => {
  const query = `    SELECT
    t.train_id,
    t.train_number,
    t.train_name,
    s1.station_id AS selected_source_station_id,
    s1.station_code AS selected_source_code,
    s1.station_name AS selected_source_name,
    s2.station_id AS selected_destination_station_id,
    s2.station_code AS selected_destination_code,
    s2.station_name AS selected_destination_name,
    tr_source.stop_order AS source_stop_order,
    tr_dest.stop_order AS destination_stop_order,
    tr_source.departure_time AS selected_departure_time,
    tr_dest.arrival_time AS selected_arrival_time
FROM trains t
JOIN train_routes tr_source
    ON t.train_id = tr_source.train_id
JOIN train_routes tr_dest
    ON t.train_id = tr_dest.train_id
JOIN stations s1
    ON tr_source.station_id = s1.station_id
JOIN stations s2
    ON tr_dest.station_id = s2.station_id
WHERE s1.station_code = $1
AND s2.station_code = $2
AND tr_source.stop_order < tr_dest.stop_order;`;
  const result = await pool.query(query, [Scode, Dcode]);
  return result.rows;
};
export const trainDetails = async (train_id, source_code, destination_code) => {
  const query = `WITH selected_segment AS (
  SELECT
    MAX(CASE WHEN s.station_code = $2 THEN tr.stop_order END) AS source_order,
    MAX(CASE WHEN s.station_code = $3 THEN tr.stop_order END) AS destination_order
  FROM train_routes tr
  JOIN stations s ON s.station_id = tr.station_id
  WHERE tr.train_id = $1
)
SELECT
    t.train_id,
    t.train_number,
    t.train_name,
    s.station_id,
    tr.stop_order,
    s.station_code,
    s.station_name,
    tr.arrival_time,
    tr.departure_time
FROM trains t
JOIN train_routes tr
    ON t.train_id = tr.train_id
JOIN stations s
    ON tr.station_id = s.station_id
JOIN selected_segment segment ON true
WHERE t.train_id = $1
AND (
  $2::text IS NULL
  OR $3::text IS NULL
  OR tr.stop_order BETWEEN segment.source_order AND segment.destination_order
)
ORDER BY tr.stop_order;`;
  const result = await pool.query(query, [train_id, source_code || null, destination_code || null]);
  return result.rows;
};

export const getCoachesByTrain = async (train_id) => {
  const query = `SELECT coach_id, coach_name, coach_type, total_seats
                 FROM coaches
                 WHERE train_id = $1
                 ORDER BY coach_name;`;
  const result = await pool.query(query, [train_id]);
  return result.rows;
};

export const getSeatAvailability = async (
  train_id,
  travel_date,
  coach_name,
) => {
  const query = `
    SELECT
      t.train_number,
      t.train_name,
      c.coach_name,
      c.coach_type,
      c.total_seats,
      COUNT(bs.seat_id) AS booked_seats,
      c.total_seats - COUNT(bs.seat_id) AS available_seats
    FROM trains t
    JOIN coaches c
      ON t.train_id = c.train_id
    LEFT JOIN seats s
      ON c.coach_id = s.coach_id
    LEFT JOIN booked_seats bs
      ON s.seat_id = bs.seat_id
      AND bs.travel_date = $2

    WHERE t.train_id = $1
    AND c.coach_name = $3
    GROUP BY t.train_number, t.train_name, c.coach_name, c.coach_type, c.total_seats;
  `;

  const result = await pool.query(query, [train_id, travel_date, coach_name]);

  return result.rows[0];
};
