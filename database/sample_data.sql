INSERT INTO stations (station_code, station_name) VALUES
  ('SC', 'Secunderabad Junction'),
  ('KZJ', 'Kazipet Junction'),
  ('BZA', 'Vijayawada Junction'),
  ('RJY', 'Rajahmundry'),
  ('VSKP', 'Visakhapatnam Junction'),
  ('MAS', 'MGR Chennai Central'),
  ('SBC', 'KSR Bengaluru City'),
  ('NDLS', 'New Delhi'),
  ('BPL', 'Bhopal Junction'),
  ('NGP', 'Nagpur Junction')
ON CONFLICT (station_code) DO NOTHING;

INSERT INTO trains (
  train_number,
  train_name,
  source_station_id,
  destination_station_id,
  departure_time,
  arrival_time,
  total_distance
)
SELECT '12704', 'Falaknuma Express', src.station_id, dest.station_id, '16:00', '06:30', 710
FROM stations src, stations dest
WHERE src.station_code = 'SC' AND dest.station_code = 'VSKP'
ON CONFLICT (train_number) DO NOTHING;

INSERT INTO trains (
  train_number,
  train_name,
  source_station_id,
  destination_station_id,
  departure_time,
  arrival_time,
  total_distance
)
SELECT '12007', 'Shatabdi Express', src.station_id, dest.station_id, '06:00', '11:00', 362
FROM stations src, stations dest
WHERE src.station_code = 'MAS' AND dest.station_code = 'SBC'
ON CONFLICT (train_number) DO NOTHING;

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
    ('12007', 'MAS', 1, '06:00', '06:00', 0),
    ('12007', 'SBC', 2, '11:00', '11:00', 362)
) AS route(train_number, station_code, stop_order, arrival_time, departure_time, distance_from_source)
  ON t.train_number = route.train_number
JOIN stations s
  ON s.station_code = route.station_code
ON CONFLICT (train_id, station_id) DO NOTHING;

INSERT INTO coaches (train_id, coach_name, coach_type, total_seats)
SELECT t.train_id, coach.coach_name, coach.coach_type, coach.total_seats
FROM trains t
CROSS JOIN (
  VALUES
    ('A1', 'AC First Class', 24),
    ('B1', 'AC 3 Tier', 64),
    ('S1', 'Sleeper', 72)
) AS coach(coach_name, coach_type, total_seats)
ON CONFLICT (train_id, coach_name) DO NOTHING;

INSERT INTO seats (coach_id, seat_number, berth_type)
SELECT
  c.coach_id,
  seat_number,
  CASE
    WHEN seat_number % 8 IN (1, 4) THEN 'Lower'
    WHEN seat_number % 8 IN (2, 5) THEN 'Middle'
    WHEN seat_number % 8 IN (3, 6) THEN 'Upper'
    WHEN seat_number % 8 = 7 THEN 'Side Lower'
    ELSE 'Side Upper'
  END AS berth_type
FROM coaches c
CROSS JOIN LATERAL generate_series(1, c.total_seats) AS seat_number
ON CONFLICT (coach_id, seat_number) DO NOTHING;
