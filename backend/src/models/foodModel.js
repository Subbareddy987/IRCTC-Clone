import pool from "../config/db.js";

export const getFoodStationsByBooking = async (booking_id) => {
  const query = `
    WITH booking_route AS (
      SELECT
        b.train_id,
        src_route.stop_order AS source_order,
        dest_route.stop_order AS destination_order
      FROM bookings b
      JOIN train_routes src_route
        ON b.train_id = src_route.train_id
       AND b.source_station_id = src_route.station_id
      JOIN train_routes dest_route
        ON b.train_id = dest_route.train_id
       AND b.destination_station_id = dest_route.station_id
      WHERE b.booking_id = $1
    )

    SELECT DISTINCT
      s.station_id,
      s.station_code,
      s.station_name,
      tr.arrival_time,
      tr.departure_time,
      tr.stop_order

    FROM booking_route br

    JOIN train_routes tr
      ON br.train_id = tr.train_id

    JOIN stations s
      ON tr.station_id = s.station_id

    JOIN station_food_menu sfm
      ON sfm.station_code = s.station_code

    WHERE tr.stop_order > br.source_order
      AND tr.stop_order <= br.destination_order

    ORDER BY tr.stop_order;
  `;

  const result = await pool.query(query, [booking_id]);

  return result.rows;
};

export const getFoodStationsForJourney = async (
  train_id,
  source_station_id,
  destination_station_id,
) => {
  const query = `
    WITH selected_route AS (
      SELECT
        source_route.stop_order AS source_order,
        destination_route.stop_order AS destination_order
      FROM train_routes source_route
      JOIN train_routes destination_route
        ON destination_route.train_id = source_route.train_id
      WHERE source_route.train_id = $1
        AND source_route.station_id = $2
        AND destination_route.station_id = $3
        AND source_route.stop_order < destination_route.stop_order
    )
    SELECT DISTINCT
      s.station_id,
      s.station_code,
      s.station_name,
      tr.arrival_time,
      tr.departure_time,
      tr.stop_order
    FROM selected_route sr
    JOIN train_routes tr
      ON tr.train_id = $1
     AND tr.stop_order > sr.source_order
     AND tr.stop_order <= sr.destination_order
    JOIN stations s
      ON tr.station_id = s.station_id
    JOIN station_food_menu sfm
      ON sfm.station_code = s.station_code
    JOIN food_items fi
      ON fi.food_id = sfm.food_id
    WHERE fi.is_available = true
      AND COALESCE(sfm.available_qty, 0) > 0
    ORDER BY tr.stop_order;
  `;

  const result = await pool.query(query, [
    train_id,
    source_station_id,
    destination_station_id,
  ]);

  return result.rows;
};

export const getStationFoodMenu = async (station_code) => {
  const query = `
    SELECT
      sfm.menu_id,
      sfm.station_code,
      sfm.available_qty,
      fi.food_id,
      fi.food_name,
      fi.category,
      fi.price,
      fi.image_url,
      fi.is_available
    FROM station_food_menu sfm
    JOIN food_items fi
      ON fi.food_id = sfm.food_id
    WHERE sfm.station_code = $1
      AND fi.is_available = true
      AND COALESCE(sfm.available_qty, 0) > 0
    ORDER BY fi.category, fi.food_name;
  `;

  const result = await pool.query(query, [station_code]);

  return result.rows;
};
