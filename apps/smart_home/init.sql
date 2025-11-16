-- Create the database if it doesn't exist
CREATE DATABASE smarthome;

-- Connect to the database
\c smarthome;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the sensors table
CREATE TABLE IF NOT EXISTS sensors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    value FLOAT DEFAULT 0,
    unit VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'inactive',
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_sensors_type ON sensors(type);
CREATE INDEX IF NOT EXISTS idx_sensors_location ON sensors(location);
CREATE INDEX IF NOT EXISTS idx_sensors_status ON sensors(status);

-- Seed initial sensors (temperature) for demo
INSERT INTO sensors (name, type, location, value, unit, status)
VALUES
    ('Living Room Temperature', 'temperature', 'Living Room', 0, '°C', 'inactive'),
    ('Bedroom Temperature', 'temperature', 'Bedroom', 0, '°C', 'inactive'),
    ('Kitchen Temperature', 'temperature', 'Kitchen', 0, '°C', 'inactive'),
    ('Office Temperature', 'temperature', 'Office', 0, '°C', 'inactive'),
    ('Outdoor Temperature', 'temperature', 'Outdoor', 0, '°C', 'inactive');

-- =======================
-- Device Registry database (per C4/ER)
-- =======================
DO
$$
BEGIN
   PERFORM 1 FROM pg_database WHERE datname = 'device_registry';
   IF NOT FOUND THEN
      EXECUTE 'CREATE DATABASE device_registry';
   END IF;
END
$$;

\c device_registry;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS device_types (
    id UUID PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('sensor','actuator'))
);

CREATE TABLE IF NOT EXISTS module_types (
    id UUID PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY,
    module_type_id UUID NOT NULL REFERENCES module_types(id),
    house_id UUID NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY, -- allow known IDs '1','2','3' for TEMP_SENSOR
    device_type_id UUID NOT NULL REFERENCES device_types(id),
    module_id UUID NOT NULL REFERENCES modules(id),
    room_id UUID NOT NULL,
    serial_number TEXT NOT NULL,
    connection_status TEXT NOT NULL CHECK (connection_status IN ('online','offline')),
    operational_state TEXT NOT NULL,
    last_seen_at TIMESTAMPTZ
);

-- Seed types and a default module
INSERT INTO device_types (id, code, name, category) VALUES
    (gen_random_uuid(), 'TEMP_SENSOR', 'Temperature Sensor', 'sensor')
ON CONFLICT (code) DO NOTHING;
INSERT INTO device_types (id, code, name, category) VALUES
    (gen_random_uuid(), 'HEATING', 'Heating Actuator', 'actuator'),
    (gen_random_uuid(), 'LIGHT', 'Light Actuator', 'actuator'),
    (gen_random_uuid(), 'GATE', 'Gate Actuator', 'actuator'),
    (gen_random_uuid(), 'CAMERA', 'Camera', 'sensor')
ON CONFLICT (code) DO NOTHING;

INSERT INTO module_types (id, code, name) VALUES
    (gen_random_uuid(), 'HEATING_KIT', 'Heating Kit')
ON CONFLICT (code) DO NOTHING;

-- Create one default module
DO $$
DECLARE mt UUID;
DECLARE mid UUID;
DECLARE hid UUID;
BEGIN
  SELECT id INTO mt FROM module_types WHERE code='HEATING_KIT' LIMIT 1;
  IF mt IS NULL THEN
    INSERT INTO module_types (id, code, name) VALUES (gen_random_uuid(), 'HEATING_KIT', 'Heating Kit') RETURNING id INTO mt;
  END IF;
  hid := gen_random_uuid();
  mid := gen_random_uuid();
  IF NOT EXISTS (SELECT 1 FROM modules) THEN
    INSERT INTO modules(id, module_type_id, house_id, name) VALUES (mid, mt, hid, 'Default kit');
  END IF;
END $$;

-- Seed TEMP_SENSOR devices for well-known rooms (room_id to be replaced by real rooms at runtime; keep placeholders)
-- These rows will be updated by services if needed; keep minimal initial data
INSERT INTO devices (id, device_type_id, module_id, room_id, serial_number, connection_status, operational_state, last_seen_at)
SELECT '1', dt.id, m.id, gen_random_uuid(), 'SN-THERMO-001', 'online', 'IDLE', now()
FROM device_types dt, modules m
WHERE dt.code='TEMP_SENSOR'
ON CONFLICT (id) DO NOTHING;
INSERT INTO devices (id, device_type_id, module_id, room_id, serial_number, connection_status, operational_state, last_seen_at)
SELECT '2', dt.id, m.id, gen_random_uuid(), 'SN-THERMO-002', 'online', 'IDLE', now()
FROM device_types dt, modules m
WHERE dt.code='TEMP_SENSOR'
ON CONFLICT (id) DO NOTHING;
INSERT INTO devices (id, device_type_id, module_id, room_id, serial_number, connection_status, operational_state, last_seen_at)
SELECT '3', dt.id, m.id, gen_random_uuid(), 'SN-THERMO-003', 'online', 'IDLE', now()
FROM device_types dt, modules m
WHERE dt.code='TEMP_SENSOR'
ON CONFLICT (id) DO NOTHING;

-- =======================
-- User & Houses database (per C4/ER) - minimal Rooms
-- =======================
DO
$$
BEGIN
   PERFORM 1 FROM pg_database WHERE datname = 'user_houses';
   IF NOT FOUND THEN
      EXECUTE 'CREATE DATABASE user_houses';
   END IF;
END
$$;

\c user_houses;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS houses (
    id UUID PRIMARY KEY,
    owner_id UUID,
    name TEXT NOT NULL,
    address TEXT
);

CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY,
    house_id UUID NOT NULL REFERENCES houses(id),
    name TEXT NOT NULL
);

-- Seed one house and five rooms (constant)
DO $$
DECLARE hid UUID;
BEGIN
  hid := gen_random_uuid();
  IF NOT EXISTS (SELECT 1 FROM houses) THEN
    INSERT INTO houses (id, owner_id, name, address) VALUES (hid, gen_random_uuid(), 'Demo house', 'Demo address');
  ELSE
    SELECT id INTO hid FROM houses LIMIT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM rooms) THEN
    INSERT INTO rooms (id, house_id, name) VALUES
      (gen_random_uuid(), hid, 'Living Room'),
      (gen_random_uuid(), hid, 'Bedroom'),
      (gen_random_uuid(), hid, 'Kitchen'),
      (gen_random_uuid(), hid, 'Office'),
      (gen_random_uuid(), hid, 'Outdoor');
  END IF;
END $$;