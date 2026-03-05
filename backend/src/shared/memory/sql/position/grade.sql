-- Создание типа enum для grade
CREATE TYPE gps.grade_type AS ENUM (
    '20.м',
    '19.м',
    '17.м',
    '16.м',
    '15.м',
    '14.м',
    '13.м',
    '12.м',
    '11.м',
    '6.ч',
    '5.ч',
    '4.ч',
    '3.ч'
);

-- Создание таблицы grades
CREATE TABLE IF NOT EXISTS gps.grades (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    grade_code gps.grade_type NOT NULL UNIQUE
);

-- Вставляем разряды в таблицу
INSERT INTO gps.grades (grade_code)
VALUES
    ('20.м'),
    ('19.м'),
    ('17.м'),
    ('16.м'),
    ('15.м'),
    ('14.м'),
    ('13.м'),
    ('12.м'),
    ('11.м'),
    ('6.ч'),
    ('5.ч'),
    ('4.ч'),
    ('3.ч');