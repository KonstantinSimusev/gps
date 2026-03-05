-- Создание типа enum для schedule
CREATE TYPE gps.schedule_type AS ENUM (
    '5-Б-1',
    '2-А',
    '9',
    '2'
);

-- Создание таблицы schedules
CREATE TABLE IF NOT EXISTS gps.schedules (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    schedule_code gps.schedule_type NOT NULL UNIQUE
);

-- Вставляем графики в таблицу
INSERT INTO gps.schedules (schedule_code)
VALUES
    ('5-Б-1'),
    ('2-А'),
    ('9'),
    ('2');