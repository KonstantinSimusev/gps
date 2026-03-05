-- Создание типа enum для team
CREATE TYPE gps.team_type AS ENUM (
    '1',
    '2',
    '3',
    '4',
    '5'
);

-- Создание таблицы teams
CREATE TABLE IF NOT EXISTS gps.teams (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    team_number gps.team_type NOT NULL UNIQUE
);

INSERT INTO gps.teams (team_number)
VALUES
    ('1'),
    ('2'),
    ('3'),
    ('4'),
    ('5');