CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stations (
  station_id SERIAL PRIMARY KEY,
  station_code VARCHAR(10) NOT NULL UNIQUE,
  station_name VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS trains (
  train_id SERIAL PRIMARY KEY,
  train_number VARCHAR(10) NOT NULL UNIQUE,
  train_name VARCHAR(150) NOT NULL,
  source_station_id INTEGER REFERENCES stations(station_id),
  destination_station_id INTEGER REFERENCES stations(station_id),
  departure_time TIME,
  arrival_time TIME,
  total_distance INTEGER
);

CREATE TABLE IF NOT EXISTS train_routes (
  route_id SERIAL PRIMARY KEY,
  train_id INTEGER NOT NULL REFERENCES trains(train_id) ON DELETE CASCADE,
  station_id INTEGER NOT NULL REFERENCES stations(station_id),
  stop_order INTEGER NOT NULL,
  arrival_time TIME,
  departure_time TIME,
  distance_from_source INTEGER NOT NULL DEFAULT 0,
  UNIQUE (train_id, station_id),
  UNIQUE (train_id, stop_order)
);

CREATE TABLE IF NOT EXISTS coaches (
  coach_id SERIAL PRIMARY KEY,
  train_id INTEGER NOT NULL REFERENCES trains(train_id) ON DELETE CASCADE,
  coach_name VARCHAR(10) NOT NULL,
  coach_type VARCHAR(30) NOT NULL,
  total_seats INTEGER NOT NULL,
  UNIQUE (train_id, coach_name)
);

CREATE TABLE IF NOT EXISTS seats (
  seat_id SERIAL PRIMARY KEY,
  coach_id INTEGER NOT NULL REFERENCES coaches(coach_id) ON DELETE CASCADE,
  seat_number INTEGER NOT NULL,
  berth_type VARCHAR(30) NOT NULL,
  UNIQUE (coach_id, seat_number)
);

CREATE TABLE IF NOT EXISTS bookings (
  booking_id SERIAL PRIMARY KEY,
  pnr_number VARCHAR(40) NOT NULL UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  train_id INTEGER NOT NULL REFERENCES trains(train_id),
  source_station_id INTEGER NOT NULL REFERENCES stations(station_id),
  destination_station_id INTEGER NOT NULL REFERENCES stations(station_id),
  travel_date DATE NOT NULL,
  total_passengers INTEGER NOT NULL,
  booking_status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
  booking_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS passengers (
  passenger_id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
  passenger_name VARCHAR(120) NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0),
  gender VARCHAR(20) NOT NULL,
  seat_id INTEGER NOT NULL REFERENCES seats(seat_id)
);

CREATE TABLE IF NOT EXISTS booked_seats (
  booked_seat_id SERIAL PRIMARY KEY,
  seat_id INTEGER NOT NULL REFERENCES seats(seat_id),
  train_id INTEGER NOT NULL REFERENCES trains(train_id),
  travel_date DATE NOT NULL,
  booking_id INTEGER NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
  UNIQUE (seat_id, train_id, travel_date)
);

CREATE TABLE IF NOT EXISTS food_items (
  food_id SERIAL PRIMARY KEY,
  food_name VARCHAR(120) NOT NULL,
  category VARCHAR(60) NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS station_food_menu (
  menu_id SERIAL PRIMARY KEY,
  station_code VARCHAR(10) NOT NULL REFERENCES stations(station_code),
  food_id INTEGER NOT NULL REFERENCES food_items(food_id),
  available_qty INTEGER NOT NULL DEFAULT 100 CHECK (available_qty >= 0),
  UNIQUE (station_code, food_id)
);

CREATE TABLE IF NOT EXISTS food_orders (
  food_order_id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
  delivery_station VARCHAR(10) NOT NULL REFERENCES stations(station_code),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  ordered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS food_order_items (
  order_item_id SERIAL PRIMARY KEY,
  food_order_id INTEGER NOT NULL REFERENCES food_orders(food_order_id) ON DELETE CASCADE,
  food_id INTEGER NOT NULL REFERENCES food_items(food_id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_train_routes_train_stop
  ON train_routes (train_id, stop_order);

CREATE INDEX IF NOT EXISTS idx_bookings_user
  ON bookings (user_id);

CREATE INDEX IF NOT EXISTS idx_booked_seats_lookup
  ON booked_seats (train_id, travel_date, seat_id);

CREATE INDEX IF NOT EXISTS idx_station_food_menu_station
  ON station_food_menu (station_code);

CREATE INDEX IF NOT EXISTS idx_food_orders_booking
  ON food_orders (booking_id);
