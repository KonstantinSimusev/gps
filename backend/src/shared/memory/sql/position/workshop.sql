-- Создание типа enum для workshop
CREATE TYPE gps.workshop_type AS ENUM (
    'Управление',
    'ЛПЦ-4',
    'ЛПЦ-5',
    'ЛПЦ-7',
    'ЛПЦ-8',
    'ЛПЦ-10',
    'ЛПЦ-11',
    'ПМП (южный блок)',
    'ПМП (северный блок)',
    'УВС ЛПЦ-4',
    'Центральный склад'
);

-- Создание таблицы workshops
CREATE TABLE IF NOT EXISTS gps.workshops (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    workshop_code gps.workshop_type NOT NULL UNIQUE
);

-- Вставляем цеха в таблицу
INSERT INTO gps.workshops (workshop_code)
VALUES
    ('Управление'),
    ('ЛПЦ-4'),
    ('ЛПЦ-5'),
    ('ЛПЦ-7'),
    ('ЛПЦ-8'),
    ('ЛПЦ-10'),
    ('ЛПЦ-11'),
    ('ПМП (южный блок)'),
    ('ПМП (северный блок)'),
    ('УВС ЛПЦ-4'),
    ('Центральный склад');