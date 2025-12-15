#!/bin/bash
set -e

# Часть 1: Суперпользователь создает пользователя и БД
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE USER "$DB_USER" WITH PASSWORD '$DB_PASSWORD';
  CREATE DATABASE "$DB_NAME";
  GRANT ALL PRIVILEGES ON DATABASE "$DB_NAME" TO "$DB_USER";
EOSQL

# Часть 2: Суперпользователь настраивает владельца БД и схему
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
  ALTER DATABASE "$DB_NAME" OWNER TO "$DB_USER";
  CREATE SCHEMA IF NOT EXISTS gps;
  ALTER SCHEMA gps OWNER TO "$DB_USER";
EOSQL

# Часть 3: Суперпользователь предоставляет права
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
  GRANT ALL ON ALL TABLES IN SCHEMA gps TO "$DB_USER";
  GRANT ALL ON ALL SEQUENCES IN SCHEMA gps TO "$DB_USER";
  GRANT ALL ON ALL FUNCTIONS IN SCHEMA gps TO "$DB_USER";
EOSQL

# Часть 4: Подключение к созданной базе данных, DB_USER создает таблицы и расширения
psql -v ON_ERROR_STOP=1 --username "$DB_USER" --dbname "$DB_NAME" <<-EOSQL

  -- Создание расширения для работы с UUID
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA gps;

  -- Создание типа enum для ролей
  CREATE TYPE gps.role_type AS ENUM (
    'MANAGER',
    'MASTER',
    'ADMIN',
    'USER'
  );

  -- Создание типа enum для профессий
  CREATE TYPE gps.profession_type AS ENUM (
    'Бригадир ОСП',
    'Бригадир УОП',
    'Ведущий инженер АМПП',
    'Водитель погрузчика',
    'Мастер участка',
    'Начальник участка',
    'Оператор ПУ',
    'Резчик холодного металла',
    'Укладчик-упаковщик',
    'Укладчик-упаковщик ЛУМ',
    'Штабелировщик металла',
    'Управление'
  );

  -- Создание типа enum для location
  CREATE TYPE gps.location_type AS ENUM (
    '1 ОЧЕРЕДЬ',
    '2 ОЧЕРЕДЬ',
    '3 ОЧЕРЕДЬ'
  );

  -- Создание типа enum для unit
  CREATE TYPE gps.unit_type AS ENUM (
    'СТАН',
    'АНГЦ',
    'АНО',
    'АИ',
    'АНГЦ-3'
  );

  -- Создание типа enum для railway
  CREATE TYPE gps.railway_type AS ENUM (
    'Тупик 6',
    'Тупик 7',
    'Тупик 8',
    'Тупик 10'
  );

  -- Создание типа enum для area
  CREATE TYPE gps.area_type AS ENUM (
    'Ручная упаковка',
    'ЛУМ',
    'ВЛРТ'
  );

  -- Создание таблицы users
  CREATE TABLE IF NOT EXISTS gps.users (
    id uuid DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    position_code INTEGER NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    patronymic VARCHAR(100) NOT NULL,
    profession gps.profession_type NOT NULL,
    grade INTEGER NOT NULL,
    personal_number INTEGER NOT NULL UNIQUE,
    team_number INTEGER NOT NULL,
    current_team_number INTEGER NOT NULL,
    work_schedule VARCHAR(10) NOT NULL,
    workshop_code VARCHAR(20) NOT NULL,
    login VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(512) NOT NULL,
    refresh_token VARCHAR(512),
    role gps.role_type NOT NULL,
    sort_order INTEGER NOT NULL
  );

  -- Создание таблицы shifts
  CREATE TABLE IF NOT EXISTS gps.shifts (
    id uuid DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    date DATE NOT NULL,
    shift_number INTEGER NOT NULL,
    team_number INTEGER NOT NULL,
    start_shift TIMESTAMP WITH TIME ZONE NOT NULL,
    end_shift TIMESTAMP WITH TIME ZONE NOT NULL,
    
    CONSTRAINT unique_date_team UNIQUE (date, team_number),
    CONSTRAINT unique_date_shift UNIQUE (date, shift_number)
  );

  -- Создание таблицы user_shifts
  CREATE TABLE IF NOT EXISTS gps.users_shifts (
    id uuid DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    work_status VARCHAR(255) NOT NULL,
    work_place VARCHAR(255) NOT NULL,
    shift_profession VARCHAR(255),
    work_hours DECIMAL(4, 1) NOT NULL,
    user_id uuid NOT NULL,
    shift_id uuid NOT NULL,

    CONSTRAINT unique_user_shift UNIQUE (user_id, shift_id),

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES gps.users(id),
    CONSTRAINT fk_shift FOREIGN KEY (shift_id) REFERENCES gps.shifts(id) ON DELETE CASCADE
  );

  -- Создание таблицы productions
  CREATE TABLE IF NOT EXISTS gps.productions (
    id uuid DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    location gps.location_type NOT NULL,
    unit gps.unit_type NOT NULL,
    count INTEGER NOT NULL,
    sort_order INTEGER NOT NULL,
    shift_id uuid NOT NULL,

    CONSTRAINT fk_shift FOREIGN KEY (shift_id) REFERENCES gps.shifts(id) ON DELETE CASCADE
  );

  -- Создание таблицы shipments
  CREATE TABLE IF NOT EXISTS gps.shipments (
    id uuid DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    location gps.location_type NOT NULL,
    railway gps.railway_type NOT NULL,
    count INTEGER NOT NULL,
    sort_order INTEGER NOT NULL,
    shift_id uuid NOT NULL,

    CONSTRAINT fk_shift FOREIGN KEY (shift_id) REFERENCES gps.shifts(id) ON DELETE CASCADE
  );

  -- Создание таблицы packs
  CREATE TABLE IF NOT EXISTS gps.packs (
    id uuid DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    location gps.location_type NOT NULL,
    area gps.area_type NOT NULL,
    count INTEGER NOT NULL,
    sort_order INTEGER NOT NULL,
    shift_id uuid NOT NULL,

    CONSTRAINT fk_shift FOREIGN KEY (shift_id) REFERENCES gps.shifts(id) ON DELETE CASCADE
  );

  -- Создание таблицы fixs
  CREATE TABLE IF NOT EXISTS gps.fixs (
    id uuid DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    location gps.location_type NOT NULL,
    railway gps.railway_type NOT NULL,
    count INTEGER NOT NULL,
    sort_order INTEGER NOT NULL,
    shift_id uuid NOT NULL,

    CONSTRAINT fk_shift FOREIGN KEY (shift_id) REFERENCES gps.shifts(id) ON DELETE CASCADE
  );

  -- Создание таблицы residues
  CREATE TABLE IF NOT EXISTS gps.residues (
    id uuid DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    location gps.location_type NOT NULL,
    area gps.area_type NOT NULL,
    count INTEGER NOT NULL,
    sort_order INTEGER NOT NULL,
    shift_id uuid NOT NULL,

    CONSTRAINT fk_shift FOREIGN KEY (shift_id) REFERENCES gps.shifts(id) ON DELETE CASCADE
  );
EOSQL
