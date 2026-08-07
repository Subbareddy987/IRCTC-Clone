import pool from "../config/db.js";

const DEFAULT_FOOD_CATALOG = [
  { food_name: "Chicken Biryani", category: "Biryani", price: 220, image_url: "/food/chicken-biryani.png", available_qty: 90 },
  { food_name: "Veg Biryani", category: "Biryani", price: 180, image_url: "/food/veg-biryani.png", available_qty: 120 },
  { food_name: "South Indian Thali", category: "Meals", price: 140, image_url: "/food/south-indian-thali.png", available_qty: 100 },
  { food_name: "Veg Meals", category: "Meals", price: 120, image_url: "/food/veg-meals.png", available_qty: 150 },
  { food_name: "Paneer Curry", category: "Curry", price: 170, image_url: "/food/paneer-curry.png", available_qty: 90 },
  { food_name: "Masala Dosa", category: "Breakfast", price: 90, image_url: "/food/masala-dosa.png", available_qty: 100 },
  { food_name: "Dosa", category: "Breakfast", price: 80, image_url: "/food/dosa.png", available_qty: 120 },
  { food_name: "Idli Sambar", category: "Breakfast", price: 60, image_url: "/food/idli-sambar.png", available_qty: 140 },
  { food_name: "Idli", category: "Breakfast", price: 60, image_url: "/food/idli.png", available_qty: 140 },
  { food_name: "Vada", category: "Snacks", price: 30, image_url: "/food/vada.png", available_qty: 100 },
  { food_name: "Poori", category: "Breakfast", price: 80, image_url: "/food/poori.png", available_qty: 95 },
  { food_name: "Samosa", category: "Snacks", price: 25, image_url: "/food/samosa.png", available_qty: 200 },
  { food_name: "Burger", category: "Fast Food", price: 120, image_url: "/food/burger.png", available_qty: 80 },
  { food_name: "Veg Sandwich", category: "Snacks", price: 80, image_url: "/food/sandwich.png", available_qty: 90 },
  { food_name: "French Fries", category: "Fast Food", price: 100, image_url: "/food/fries.png", available_qty: 110 },
  { food_name: "Fried Rice", category: "Rice", price: 150, image_url: "/food/fried-rice.png", available_qty: 100 },
  { food_name: "Coffee", category: "Beverages", price: 30, image_url: "/food/coffee.png", available_qty: 250 },
  { food_name: "Tea", category: "Beverages", price: 20, image_url: "/food/tea.png", available_qty: 300 },
  { food_name: "Cool Drink", category: "Drinks", price: 40, image_url: "/food/cooldrink.png", available_qty: 200 },
  { food_name: "Fruit Juice", category: "Drinks", price: 50, image_url: "/food/juice.png", available_qty: 150 },
  { food_name: "Water Bottle", category: "Drinks", price: 20, image_url: "/food/water.png", available_qty: 300 },
  { food_name: "Ice Cream", category: "Dessert", price: 70, image_url: "/food/icecream.png", available_qty: 120 },
  { food_name: "Chocolate Cake", category: "Dessert", price: 90, image_url: "/food/cake.png", available_qty: 90 },
];

const ensureFullStationMenu = async (station_code) => {
  for (const item of DEFAULT_FOOD_CATALOG) {
    const foodResult = await pool.query(
      `
        WITH existing AS (
          SELECT food_id
          FROM food_items
          WHERE LOWER(food_name) = LOWER($1)
          ORDER BY food_id
          LIMIT 1
        ),
        inserted AS (
          INSERT INTO food_items (food_name, category, price, image_url, is_available)
          SELECT $1, $2, $3, $4, true
          WHERE NOT EXISTS (SELECT 1 FROM existing)
          RETURNING food_id
        )
        SELECT food_id FROM inserted
        UNION ALL
        SELECT food_id FROM existing
        LIMIT 1;
      `,
      [item.food_name, item.category, item.price, item.image_url],
    );

    const foodId = foodResult.rows[0]?.food_id;
    if (!foodId) continue;

    await pool.query(
      `
        UPDATE food_items
        SET category = $2,
            price = $3,
            image_url = $4,
            is_available = true
        WHERE food_id = $1;
      `,
      [foodId, item.category, item.price, item.image_url],
    );

    await pool.query(
      `
        INSERT INTO station_food_menu (station_code, food_id, available_qty)
        VALUES ($1, $2, $3)
        ON CONFLICT (station_code, food_id) DO NOTHING;
      `,
      [station_code, foodId, item.available_qty],
    );
  }
};

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
     AND tr.stop_order > sr.source_order
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
  try {
    await ensureFullStationMenu(station_code);

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
    return dbResult.rows || [];
  } catch (error) {
    console.error("Food menu fetch error:", error);
    return [];
  }
};
