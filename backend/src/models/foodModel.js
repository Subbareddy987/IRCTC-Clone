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
     AND tr.stop_order >= sr.source_order
     AND tr.stop_order <= sr.destination_order
    JOIN stations s
      ON tr.station_id = s.station_id
    ORDER BY tr.stop_order;
  `;

  const result = await pool.query(query, [
    train_id,
    source_station_id,
    destination_station_id,
  ]);

  if (result.rows.length > 0) {
    return result.rows;
  }

  const fallbackQuery = `
    SELECT DISTINCT
      s.station_id,
      s.station_code,
      s.station_name,
      tr.arrival_time,
      tr.departure_time,
      tr.stop_order
    FROM train_routes tr
    JOIN stations s
      ON tr.station_id = s.station_id
    WHERE tr.train_id = $1
    ORDER BY tr.stop_order;
  `;

  const fallbackRes = await pool.query(fallbackQuery, [train_id]);
  return fallbackRes.rows;
};

export const getStationFoodMenu = async (station_code) => {
  const DEFAULT_IRCTC_MENU = [
    { food_id: 101, food_name: "Veg Biryani", category: "Biryani", price: "180.00", image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60", available_qty: 120, is_available: true, station_code },
    { food_id: 102, food_name: "Chicken Biryani", category: "Biryani", price: "240.00", image_url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=60", available_qty: 85, is_available: true, station_code },
    { food_id: 103, food_name: "Standard Veg Thali", category: "Meals", price: "150.00", image_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60", available_qty: 150, is_available: true, station_code },
    { food_id: 104, food_name: "Paneer Butter Masala & Naan", category: "Meals", price: "210.00", image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60", available_qty: 90, is_available: true, station_code },
    { food_id: 105, food_name: "Masala Dosa & Sambar", category: "Breakfast", price: "90.00", image_url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60", available_qty: 100, is_available: true, station_code },
    { food_id: 106, food_name: "Hot Samosa & Masala Chai (2 Pcs)", category: "Snacks", price: "50.00", image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60", available_qty: 200, is_available: true, station_code },
    { food_id: 107, food_name: "Mineral Water Bottle (1L)", category: "Drinks", price: "20.00", image_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=60", available_qty: 300, is_available: true, station_code },
    { food_id: 108, food_name: "Fresh Mango Lassi", category: "Drinks", price: "60.00", image_url: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=60", available_qty: 110, is_available: true, station_code },
    { food_id: 109, food_name: "Gulab Jamun (2 Pcs)", category: "Desserts", price: "60.00", image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60", available_qty: 140, is_available: true, station_code }
  ];

  try {
    const stationMenuQuery = `
      SELECT DISTINCT ON (fi.food_name)
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
      ORDER BY fi.food_name, fi.food_id DESC;
    `;

    const dbResult = await pool.query(stationMenuQuery, [station_code]);
    const dbItems = dbResult.rows || [];

    const existingNames = new Set(dbItems.map((item) => item.food_name.toLowerCase()));
    const merged = [...dbItems];

    for (const item of DEFAULT_IRCTC_MENU) {
      if (!existingNames.has(item.food_name.toLowerCase())) {
        merged.push({ ...item, station_code });
      }
    }

    return merged;
  } catch (error) {
    console.error("Food menu fetch error:", error);
    return DEFAULT_IRCTC_MENU;
  }
};
