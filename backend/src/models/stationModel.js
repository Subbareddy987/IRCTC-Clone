import pool from "../config/db.js";

export const getAllStations = async () => {
  const result = await pool.query(`
    SELECT
      station_id,
      station_code,
      station_name
    FROM stations
    ORDER BY station_name
  `);

  return result.rows;
};