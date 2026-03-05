-- Создание таблицы employees
  CREATE TABLE IF NOT EXISTS gps.employees (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    patronymic VARCHAR(40) NOT NULL,
    personal_number VARCHAR(10) NOT NULL UNIQUE,
    birth_date DATE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    position_id UUID NOT NULL,
    team_id UUID NOT NULL,

    CONSTRAINT unique_person_full_name UNIQUE (last_name, first_name, patronymic),
    CONSTRAINT fk__position FOREIGN KEY (position_id) REFERENCES gps.positions(id),
    CONSTRAINT fk__team FOREIGN KEY (team_id) REFERENCES gps.teams(id)
  );
