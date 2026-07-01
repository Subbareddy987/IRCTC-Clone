INSERT INTO stations (station_code, station_name) VALUES
  ('SC', 'Secunderabad Junction'),
  ('HYB', 'Hyderabad Deccan'),
  ('WL', 'Warangal'),
  ('KZJ', 'Kazipet Junction'),
  ('BZA', 'Vijayawada Junction'),
  ('GNT', 'Guntur Junction'),
  ('OGL', 'Ongole'),
  ('NLR', 'Nellore'),
  ('GDR', 'Gudur Junction'),
  ('RJY', 'Rajahmundry'),
  ('VSKP', 'Visakhapatnam Junction'),
  ('MAS', 'MGR Chennai Central'),
  ('KPD', 'Katpadi Junction'),
  ('JTJ', 'Jolarpettai Junction'),
  ('SBC', 'KSR Bengaluru City'),
  ('TPTY', 'Tirupati'),
  ('NDLS', 'New Delhi'),
  ('BPL', 'Bhopal Junction'),
  ('NGP', 'Nagpur Junction'),
  ('HWH', 'Howrah Junction'),
  ('CSMT', 'Chhatrapati Shivaji Maharaj Terminus'),
  ('PUNE', 'Pune Junction')
ON CONFLICT (station_code) DO UPDATE
SET station_name = EXCLUDED.station_name;

INSERT INTO trains (
  train_number,
  train_name,
  source_station_id,
  destination_station_id,
  departure_time,
  arrival_time,
  total_distance
)
SELECT train.train_number, train.train_name, src.station_id, dest.station_id, train.departure_time::time, train.arrival_time::time, train.total_distance
FROM (
  VALUES
    ('12704', 'Falaknuma Express', 'SC', 'VSKP', '16:00', '06:30', 710),
    ('12760', 'Charminar Express', 'HYB', 'MAS', '18:00', '08:00', 790),
    ('12711', 'Pinakini Express', 'BZA', 'MAS', '06:10', '13:00', 430),
    ('20805', 'Andhra Pradesh Express', 'VSKP', 'NDLS', '22:00', '05:40', 2100),
    ('12007', 'Shatabdi Express', 'MAS', 'SBC', '06:00', '11:00', 362),
    ('17230', 'Sabari Express', 'SC', 'TPTY', '12:20', '22:10', 662),
    ('12839', 'Howrah Mail', 'HWH', 'MAS', '23:55', '04:30', 1660),
    ('11020', 'Konark Express', 'BZA', 'CSMT', '04:20', '03:55', 1120)
) AS train(train_number, train_name, source_code, destination_code, departure_time, arrival_time, total_distance)
JOIN stations src
  ON src.station_code = train.source_code
JOIN stations dest
  ON dest.station_code = train.destination_code
ON CONFLICT (train_number) DO UPDATE
SET train_name = EXCLUDED.train_name,
    source_station_id = EXCLUDED.source_station_id,
    destination_station_id = EXCLUDED.destination_station_id,
    departure_time = EXCLUDED.departure_time,
    arrival_time = EXCLUDED.arrival_time,
    total_distance = EXCLUDED.total_distance;

DELETE FROM train_routes
WHERE train_id IN (
  SELECT train_id
  FROM trains
  WHERE train_number IN (
    '12704',
    '12760',
    '12711',
    '20805',
    '12007',
    '17230',
    '12839',
    '11020'
  )
);

INSERT INTO train_routes (
  train_id,
  station_id,
  stop_order,
  arrival_time,
  departure_time,
  distance_from_source
)
SELECT t.train_id, s.station_id, route.stop_order, route.arrival_time::time, route.departure_time::time, route.distance_from_source
FROM trains t
JOIN (
  VALUES
    ('12704', 'SC', 1, '16:00', '16:00', 0),
    ('12704', 'KZJ', 2, '18:00', '18:05', 132),
    ('12704', 'BZA', 3, '22:30', '22:40', 351),
    ('12704', 'RJY', 4, '01:30', '01:35', 500),
    ('12704', 'VSKP', 5, '06:30', '06:30', 710),

    ('12760', 'HYB', 1, '18:00', '18:00', 0),
    ('12760', 'SC', 2, '18:25', '18:30', 9),
    ('12760', 'KZJ', 3, '20:30', '20:35', 142),
    ('12760', 'BZA', 4, '01:20', '01:30', 361),
    ('12760', 'OGL', 5, '03:45', '03:47', 500),
    ('12760', 'NLR', 6, '05:05', '05:07', 616),
    ('12760', 'GDR', 7, '06:00', '06:02', 654),
    ('12760', 'MAS', 8, '08:00', '08:00', 790),

    ('12711', 'BZA', 1, '06:10', '06:10', 0),
    ('12711', 'GNT', 2, '06:50', '06:55', 32),
    ('12711', 'OGL', 3, '09:05', '09:07', 169),
    ('12711', 'NLR', 4, '10:20', '10:22', 285),
    ('12711', 'GDR', 5, '11:00', '11:02', 323),
    ('12711', 'MAS', 6, '13:00', '13:00', 430),

    ('20805', 'VSKP', 1, '22:00', '22:00', 0),
    ('20805', 'RJY', 2, '01:00', '01:05', 201),
    ('20805', 'BZA', 3, '03:35', '03:45', 350),
    ('20805', 'WL', 4, '06:45', '06:50', 560),
    ('20805', 'NGP', 5, '14:15', '14:25', 1030),
    ('20805', 'BPL', 6, '20:10', '20:20', 1420),
    ('20805', 'NDLS', 7, '05:40', '05:40', 2100),

    ('12007', 'MAS', 1, '06:00', '06:00', 0),
    ('12007', 'KPD', 2, '07:25', '07:27', 130),
    ('12007', 'JTJ', 3, '08:45', '08:47', 213),
    ('12007', 'SBC', 4, '11:00', '11:00', 362),

    ('17230', 'SC', 1, '12:20', '12:20', 0),
    ('17230', 'KZJ', 2, '14:25', '14:30', 132),
    ('17230', 'BZA', 3, '18:35', '18:45', 351),
    ('17230', 'GDR', 4, '23:30', '23:35', 674),
    ('17230', 'TPTY', 5, '02:15', '02:15', 662),

    ('12839', 'HWH', 1, '23:55', '23:55', 0),
    ('12839', 'VSKP', 2, '13:10', '13:30', 882),
    ('12839', 'BZA', 3, '19:40', '19:50', 1230),
    ('12839', 'NLR', 4, '00:25', '00:27', 1515),
    ('12839', 'MAS', 5, '04:30', '04:30', 1660),

    ('11020', 'BZA', 1, '04:20', '04:20', 0),
    ('11020', 'SC', 2, '10:10', '10:20', 351),
    ('11020', 'NGP', 3, '18:45', '18:55', 930),
    ('11020', 'PUNE', 4, '00:55', '01:05', 1000),
    ('11020', 'CSMT', 5, '03:55', '03:55', 1120)
) AS route(train_number, station_code, stop_order, arrival_time, departure_time, distance_from_source)
  ON t.train_number = route.train_number
JOIN stations s
  ON s.station_code = route.station_code
ON CONFLICT (train_id, station_id) DO UPDATE
SET stop_order = EXCLUDED.stop_order,
    arrival_time = EXCLUDED.arrival_time,
    departure_time = EXCLUDED.departure_time,
    distance_from_source = EXCLUDED.distance_from_source;

INSERT INTO coaches (train_id, coach_name, coach_type, total_seats)
SELECT t.train_id, coach.coach_name, coach.coach_type, coach.total_seats
FROM trains t
CROSS JOIN (
  VALUES
    ('A1', 'AC 2 Tier', 48),
    ('B1', 'AC 3 Tier', 64),
    ('B2', 'AC 3 Tier', 64),
    ('S1', 'Sleeper', 72),
    ('S2', 'Sleeper', 72),
    ('S3', 'Sleeper', 72)
) AS coach(coach_name, coach_type, total_seats)
ON CONFLICT (train_id, coach_name) DO UPDATE
SET coach_type = EXCLUDED.coach_type,
    total_seats = EXCLUDED.total_seats;

INSERT INTO seats (coach_id, seat_number, berth_type)
SELECT
  c.coach_id,
  seat_number,
  CASE
    WHEN c.coach_type = 'AC 2 Tier' AND seat_number % 6 IN (1, 3) THEN 'Lower'
    WHEN c.coach_type = 'AC 2 Tier' AND seat_number % 6 IN (2, 4) THEN 'Upper'
    WHEN c.coach_type = 'AC 2 Tier' AND seat_number % 6 = 5 THEN 'Side Lower'
    WHEN c.coach_type = 'AC 2 Tier' THEN 'Side Upper'
    WHEN seat_number % 8 IN (1, 4) THEN 'Lower'
    WHEN seat_number % 8 IN (2, 5) THEN 'Middle'
    WHEN seat_number % 8 IN (3, 6) THEN 'Upper'
    WHEN seat_number % 8 = 7 THEN 'Side Lower'
    ELSE 'Side Upper'
  END AS berth_type
FROM coaches c
CROSS JOIN LATERAL generate_series(1, c.total_seats) AS seat_number
ON CONFLICT (coach_id, seat_number) DO UPDATE
SET berth_type = EXCLUDED.berth_type;

INSERT INTO food_items (food_name, category, price, image_url, is_available)
SELECT food_name, category, price, image_url, true
FROM (
  VALUES
    ('Veg Meals', 'Meals', 120.00, '/food/veg-meals.png'),
    ('Chicken Biryani', 'Biryani', 220.00, '/food/chicken-biryani.png'),
    ('Veg Biryani', 'Biryani', 180.00, '/food/veg-biryani.png'),
    ('Fried Rice', 'Rice', 150.00, '/food/fried-rice.png'),
    ('Paneer Curry', 'Curry', 170.00, '/food/paneer-curry.png'),
    ('Idli', 'Breakfast', 60.00, '/food/idli.png'),
    ('Dosa', 'Breakfast', 90.00, '/food/dosa.png'),
    ('Poori', 'Breakfast', 80.00, '/food/poori.png'),
    ('Samosa', 'Snacks', 25.00, '/food/samosa.png'),
    ('Vada', 'Snacks', 30.00, '/food/vada.png'),
    ('Tea', 'Beverages', 20.00, '/food/tea.png'),
    ('Coffee', 'Beverages', 30.00, '/food/coffee.png'),
    ('Water Bottle', 'Drinks', 20.00, '/food/water.png'),
    ('Cool Drink', 'Drinks', 40.00, '/food/cooldrink.png'),
    ('Fruit Juice', 'Drinks', 50.00, '/food/juice.png'),
    ('Chocolate Cake', 'Dessert', 90.00, '/food/cake.png'),
    ('Ice Cream', 'Dessert', 70.00, '/food/icecream.png'),
    ('Veg Sandwich', 'Snacks', 80.00, '/food/sandwich.png'),
    ('Burger', 'Fast Food', 120.00, '/food/burger.png'),
    ('French Fries', 'Fast Food', 100.00, '/food/fries.png'),
    ('South Indian Thali', 'Meals', 140.00, '/food/south-indian-thali.png'),
    ('Idli Sambar', 'Breakfast', 60.00, '/food/idli-sambar.png'),
    ('Masala Dosa', 'Breakfast', 90.00, '/food/masala-dosa.png')
) AS food(food_name, category, price, image_url)
WHERE NOT EXISTS (
  SELECT 1
  FROM food_items existing
  WHERE existing.food_name = food.food_name
);

UPDATE food_items existing
SET category = food.category,
    price = food.price,
    image_url = food.image_url,
    is_available = true
FROM (
  VALUES
    ('Veg Meals', 'Meals', 120.00, '/food/veg-meals.png'),
    ('Chicken Biryani', 'Biryani', 220.00, '/food/chicken-biryani.png'),
    ('Veg Biryani', 'Biryani', 180.00, '/food/veg-biryani.png'),
    ('Fried Rice', 'Rice', 150.00, '/food/fried-rice.png'),
    ('Paneer Curry', 'Curry', 170.00, '/food/paneer-curry.png'),
    ('Idli', 'Breakfast', 60.00, '/food/idli.png'),
    ('Dosa', 'Breakfast', 90.00, '/food/dosa.png'),
    ('Poori', 'Breakfast', 80.00, '/food/poori.png'),
    ('Samosa', 'Snacks', 25.00, '/food/samosa.png'),
    ('Vada', 'Snacks', 30.00, '/food/vada.png'),
    ('Tea', 'Beverages', 20.00, '/food/tea.png'),
    ('Coffee', 'Beverages', 30.00, '/food/coffee.png'),
    ('Water Bottle', 'Drinks', 20.00, '/food/water.png'),
    ('Cool Drink', 'Drinks', 40.00, '/food/cooldrink.png'),
    ('Fruit Juice', 'Drinks', 50.00, '/food/juice.png'),
    ('Chocolate Cake', 'Dessert', 90.00, '/food/cake.png'),
    ('Ice Cream', 'Dessert', 70.00, '/food/icecream.png'),
    ('Veg Sandwich', 'Snacks', 80.00, '/food/sandwich.png'),
    ('Burger', 'Fast Food', 120.00, '/food/burger.png'),
    ('French Fries', 'Fast Food', 100.00, '/food/fries.png'),
    ('South Indian Thali', 'Meals', 140.00, '/food/south-indian-thali.png'),
    ('Idli Sambar', 'Breakfast', 60.00, '/food/idli-sambar.png'),
    ('Masala Dosa', 'Breakfast', 90.00, '/food/masala-dosa.png')
) AS food(food_name, category, price, image_url)
WHERE existing.food_name = food.food_name;

INSERT INTO station_food_menu (station_code, food_id, available_qty)
SELECT station.station_code, item.food_id, menu.available_qty
FROM (
  VALUES
    ('SC', 'Idli Sambar', 80),
    ('SC', 'Masala Dosa', 60),
    ('SC', 'Tea', 150),
    ('SC', 'Coffee', 120),
    ('KZJ', 'Veg Sandwich', 70),
    ('KZJ', 'Samosa', 100),
    ('KZJ', 'Tea', 120),
    ('BZA', 'Veg Biryani', 120),
    ('BZA', 'Chicken Biryani', 90),
    ('BZA', 'South Indian Thali', 100),
    ('BZA', 'Water Bottle', 200),
    ('RJY', 'Veg Biryani', 70),
    ('RJY', 'Samosa', 90),
    ('OGL', 'South Indian Thali', 70),
    ('OGL', 'Coffee', 100),
    ('NLR', 'Veg Biryani', 80),
    ('NLR', 'Water Bottle', 150),
    ('GDR', 'Idli Sambar', 80),
    ('GDR', 'Tea', 120),
    ('MAS', 'South Indian Thali', 100),
    ('MAS', 'Masala Dosa', 90),
    ('MAS', 'Coffee', 150),
    ('VSKP', 'Veg Biryani', 100),
    ('VSKP', 'Chicken Biryani', 80),
    ('NGP', 'Veg Sandwich', 80),
    ('NGP', 'Tea', 150),
    ('BPL', 'Samosa', 100),
    ('BPL', 'Coffee', 100),
    ('SBC', 'Masala Dosa', 100),
    ('SBC', 'Coffee', 150),
    ('PUNE', 'Veg Sandwich', 90),
    ('PUNE', 'Water Bottle', 160)
) AS menu(station_code, food_name, available_qty)
JOIN stations station
  ON station.station_code = menu.station_code
JOIN food_items item
  ON item.food_name = menu.food_name
ON CONFLICT (station_code, food_id) DO UPDATE
SET available_qty = EXCLUDED.available_qty;

