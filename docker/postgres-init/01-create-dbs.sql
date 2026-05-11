-- Active: 1765897581018@@127.0.0.1@5432
DO
$$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'uber_users_db') THEN
    CREATE DATABASE uber_users_db;
  END IF;

  IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'uber_trip_db') THEN
    CREATE DATABASE uber_trip_db;
  END IF;

  IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'uber_dispatch_db') THEN
    CREATE DATABASE uber_dispatch_db;
  END IF;
END
$$;
