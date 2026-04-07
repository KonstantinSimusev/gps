psql -v ON_ERROR_STOP=1 --username "SysZ5vNm8KoP3qWeR" --dbname "D4t4b4s3K8jNm2Pw" -W <<-EOSQL

  -- Создание расширения для работы с UUID в схеме gps
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- Создание таблицы accounts
  CREATE TABLE IF NOT EXISTS gps.accounts (
    id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(512) NOT NULL,
    hashed_refresh_token VARCHAR(512)
  );

  -- Создание таблицы roles
  CREATE TABLE IF NOT EXISTS gps.roles (
    id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
  );

  -- Создание таблицы teams
  CREATE TABLE IF NOT EXISTS gps.teams (
    id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    team_number VARCHAR(1) NOT NULL UNIQUE
  );

  -- Создание таблицы workshops
  CREATE TABLE IF NOT EXISTS gps.workshops (
    id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    workshop_code VARCHAR(100) NOT NULL UNIQUE
  );

  -- Создание таблицы professions
  CREATE TABLE IF NOT EXISTS gps.professions (
    id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
  );

  -- Создание таблицы grades
  CREATE TABLE IF NOT EXISTS gps.grades (
    id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    grade_code VARCHAR(10) NOT NULL UNIQUE
  );

  -- Создание таблицы schedules
  CREATE TABLE IF NOT EXISTS gps.schedules (
    id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    schedule_code VARCHAR(20) NOT NULL UNIQUE,
    duration TIME NOT NULL
  );

  -- Создание таблицы positions
  CREATE TABLE IF NOT EXISTS gps.positions (
    id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    position_code VARCHAR(10) NOT NULL UNIQUE,

    workshop_id UUID NOT NULL,
    profession_id UUID NOT NULL,
    grade_id UUID NOT NULL,
    schedule_id UUID NOT NULL,
    role_id UUID NOT NULL,

    CONSTRAINT fk__workshop FOREIGN KEY (workshop_id) REFERENCES gps.workshops(id),
    CONSTRAINT fk__profession FOREIGN KEY (profession_id) REFERENCES gps.professions(id),
    CONSTRAINT fk__grade FOREIGN KEY (grade_id) REFERENCES gps.grades(id),
    CONSTRAINT fk__schedule FOREIGN KEY (schedule_id) REFERENCES gps.schedules(id),
    CONSTRAINT fk__role FOREIGN KEY (role_id) REFERENCES gps.roles(id)
  );

  -- Создание таблицы employees
  CREATE TABLE IF NOT EXISTS gps.employees (
    id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    patronymic VARCHAR(40) NOT NULL,
    personal_number VARCHAR(10) NOT NULL UNIQUE,
    birth_day DATE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    account_id UUID UNIQUE NOT NULL,
    position_id UUID NOT NULL,
    team_id UUID NOT NULL,

    CONSTRAINT unique_person_full_name UNIQUE (last_name, first_name, patronymic),

    CONSTRAINT fk__account FOREIGN KEY (account_id) REFERENCES gps.accounts(id),
    CONSTRAINT fk__position FOREIGN KEY (position_id) REFERENCES gps.positions(id),
    CONSTRAINT fk__team FOREIGN KEY (team_id) REFERENCES gps.teams(id)
  );

  -- Создание таблицы employee_roles
  CREATE TABLE IF NOT EXISTS gps.employee_roles (
    id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,

    role_id UUID NOT NULL,
    employee_id UUID NOT NULL,

    CONSTRAINT unique_employee_single_role UNIQUE (employee_id),

    CONSTRAINT fk__employee_role_role FOREIGN KEY (role_id) REFERENCES gps.roles(id),
    CONSTRAINT fk__employee_role_employee FOREIGN KEY (employee_id) REFERENCES gps.employees(id) ON DELETE CASCADE
  );

  -- Вставляем номера бригад в таблицу
  INSERT INTO gps.teams (team_number)
  VALUES
    ('1'),
    ('2'),
    ('3'),
    ('4'),
    ('5');

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

  -- Вставляем профессии в таблицу
  INSERT INTO gps.professions (name)
  VALUES
    ('Директор'),
    ('Начальник производства (в промышленности)'),
    ('Старший менеджер'),
    ('Механик'),
    ('Энергетик'),
    ('Ведущий специалист по охране труда'),
    ('Ведущий инженер'),
    ('Ведущий инженер по качеству'),
    ('Специалист по охране труда'),
    ('Инженер по подготовке производства первой категории'),
    ('Инспектор-делопроизводитель'),
    ('Распределитель работ'),
    ('Ведущий экономист'),
    ('Ведущий инженер по организации и нормированию труда'),
    ('Инженер по организации и нормированию труда первой категории'),
    ('Ведущий специалист'),
    ('Ведущий инженер-технолог'),
    ('Инженер-технолог первой категории'),
    ('Инженер первой категории'),
    ('Начальник участка (в промышленности)'),
    ('Мастер участка'),
    ('Бригадир на участках основного производства'),
    ('Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции'),
    ('Укладчик-упаковщик'),
    ('Укладчик-упаковщик ЛУМ'),
    ('Слесарь-ремонтник'),
    ('Штабелировщик металла'),
    ('Штамповщик'),
    ('Водитель погрузчика'),
    ('Резчик холодного металла'),
    ('Старший мастер участка'),
    ('Газорезчик'),
    ('Машинист крана'),
    ('Ведущий инженер по автоматизации и механизации производственных процессов'),
    ('Оператор поста управления (старший)'),
    ('Оператор поста управления'),
    ('Электромонтер по ремонту и обслуживанию электрооборудования'),
    ('Бригадир по перемещению сырья, полуфабрикатов и готовой продукции в процессе производства'),
    ('Машинист крана (крановщик)'),
    ('Кладовщик (старший)'),
    ('Водитель автомобиля'),
    ('Кладовщик');

  -- Вставляем разряды в таблицу
  INSERT INTO gps.grades (grade_code)
  VALUES
    ('20'),
    ('19'),
    ('17'),
    ('16'),
    ('15'),
    ('14'),
    ('13'),
    ('12'),
    ('11'),
    ('6'),
    ('5'),
    ('4'),
    ('3');

  -- Вставляем графики в таблицу
  INSERT INTO gps.schedules (schedule_code, duration)
  VALUES
    ('5-Б-1', '08:15'),
    ('2-А', '11:30'),
    ('9', '11:00'),
    ('2', '12:00');

  -- Вставляем роли в таблицу
  INSERT INTO gps.roles (name)
  VALUES
    ('ADMIN'), -- Администратор
    ('HEAD'), -- Начальник участка (в промышленности)
    ('DETAIL_MASTER'), -- Мастер участка реквизитов
    ('MASTER'), -- Мастер участка
    ('MECHANIC'), -- Слесарь
    ('PRODUCTION_FOREMAN'), -- Бригадир на участках основного производства
    ('PACKING_FOREMAN'), -- Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции
    ('LEAD_OPERATOR'), -- Оператор поста управления (старший)
    ('OPERATOR'), -- Оператор поста управления
    ('DRIVER'), -- Водитель погрузчика
    ('STAMPER'), -- Штамповщик
    ('PACKER'), -- Укладчик‑упаковщик
    ('UNIT_PACKER'), -- Укладчик‑упаковщик ЛУМ
    ('STACKER'), -- Штабелировщик металла
    ('CUTTER'); -- Резчик холодного металла

  -- Вставляем позиции в таблицу
  INSERT INTO gps.positions (position_code, workshop_id, profession_id, grade_id, schedule_id, role_id)
  VALUES
    ('643776', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'), (SELECT id FROM gps.professions WHERE name = 'Начальник участка (в промышленности)'), (SELECT id FROM gps.grades WHERE grade_code = '17'), (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'), (SELECT id FROM gps.roles WHERE name = 'HEAD')),
    ('643795', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'), (SELECT id FROM gps.professions WHERE name = 'Мастер участка'), (SELECT id FROM gps.grades WHERE grade_code = '13'), (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'), (SELECT id FROM gps.roles WHERE name = 'DETAIL_MASTER')),
    ('643777', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'), (SELECT id FROM gps.professions WHERE name = 'Мастер участка'), (SELECT id FROM gps.grades WHERE grade_code = '12'), (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'), (SELECT id FROM gps.roles WHERE name = 'MASTER')),
    ('643799', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'), (SELECT id FROM gps.professions WHERE name = 'Слесарь-ремонтник'), (SELECT id FROM gps.grades WHERE grade_code = '6'), (SELECT id FROM gps.schedules WHERE schedule_code = '9'), (SELECT id FROM gps.roles WHERE name = 'MECHANIC')),
    ('643796', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'), (SELECT id FROM gps.professions WHERE name = 'Бригадир на участках основного производства'), (SELECT id FROM gps.grades WHERE grade_code = '5'), (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'), (SELECT id FROM gps.roles WHERE name = 'PRODUCTION_FOREMAN')),
    ('643975', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'), (SELECT id FROM gps.professions WHERE name = 'Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции'), (SELECT id FROM gps.grades WHERE grade_code = '4'), (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'), (SELECT id FROM gps.roles WHERE name = 'PACKING_FOREMAN')),
    ('643800', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'), (SELECT id FROM gps.professions WHERE name = 'Водитель погрузчика'), (SELECT id FROM gps.grades WHERE grade_code = '4'), (SELECT id FROM gps.schedules WHERE schedule_code = '9'), (SELECT id FROM gps.roles WHERE name = 'DRIVER')),
    ('643797', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'), (SELECT id FROM gps.professions WHERE name = 'Штамповщик'), (SELECT id FROM gps.grades WHERE grade_code = '5'), (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'), (SELECT id FROM gps.roles WHERE name = 'STAMPER')),
    ('643779', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'), (SELECT id FROM gps.professions WHERE name = 'Укладчик-упаковщик'), (SELECT id FROM gps.grades WHERE grade_code = '3'), (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'), (SELECT id FROM gps.roles WHERE name = 'PACKER')),
    ('643780', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'), (SELECT id FROM gps.professions WHERE name = 'Штабелировщик металла'), (SELECT id FROM gps.grades WHERE grade_code = '3'), (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'), (SELECT id FROM gps.roles WHERE name = 'STACKER')),
    ('643842', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'), (SELECT id FROM gps.professions WHERE name = 'Начальник участка (в промышленности)'), (SELECT id FROM gps.grades WHERE grade_code = '17'), (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'), (SELECT id FROM gps.roles WHERE name = 'HEAD')),
    ('643850', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'), (SELECT id FROM gps.professions WHERE name = 'Мастер участка'), (SELECT id FROM gps.grades WHERE grade_code = '13'), (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'), (SELECT id FROM gps.roles WHERE name = 'DETAIL_MASTER')),
    ('643843', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'), (SELECT id FROM gps.professions WHERE name = 'Мастер участка'), (SELECT id FROM gps.grades WHERE grade_code = '12'), (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'), (SELECT id FROM gps.roles WHERE name = 'MASTER')),
    ('643852', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'), (SELECT id FROM gps.professions WHERE name = 'Бригадир на участках основного производства'), (SELECT id FROM gps.grades WHERE grade_code = '5'), (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'), (SELECT id FROM gps.roles WHERE name = 'PRODUCTION_FOREMAN')),
    ('643853', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'), (SELECT id FROM gps.professions WHERE name = 'Бригадир на участках основного производства'), (SELECT id FROM gps.grades WHERE grade_code = '5'), (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'), (SELECT id FROM gps.roles WHERE name = 'PRODUCTION_FOREMAN')),
    ('643847', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'), (SELECT id FROM gps.professions WHERE name = 'Оператор поста управления (старший)'), (SELECT id FROM gps.grades WHERE grade_code = '5'), (SELECT id FROM gps.schedules WHERE schedule_code = '2'), (SELECT id FROM gps.roles WHERE name = 'LEAD_OPERATOR')),
    ('643848', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'), (SELECT id FROM gps.professions WHERE name = 'Оператор поста управления'), (SELECT id FROM gps.grades WHERE grade_code = '4'), (SELECT id FROM gps.schedules WHERE schedule_code = '2'), (SELECT id FROM gps.roles WHERE name = 'OPERATOR')),
    ('643985', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'), (SELECT id FROM gps.professions WHERE name = 'Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции'), (SELECT id FROM gps.grades WHERE grade_code = '4'), (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'), (SELECT id FROM gps.roles WHERE name = 'PACKING_FOREMAN')),
    ('643984', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'), (SELECT id FROM gps.professions WHERE name = 'Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции'), (SELECT id FROM gps.grades WHERE grade_code = '4'), (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'), (SELECT id FROM gps.roles WHERE name = 'PACKING_FOREMAN')),
    ('643854', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'), (SELECT id FROM gps.professions WHERE name = 'Водитель погрузчика'), (SELECT id FROM gps.grades WHERE grade_code = '4'), (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'), (SELECT id FROM gps.roles WHERE name = 'DRIVER')),
    ('643856', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'), (SELECT id FROM gps.professions WHERE name = 'Водитель погрузчика'), (SELECT id FROM gps.grades WHERE grade_code = '4'), (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'), (SELECT id FROM gps.roles WHERE name = 'DRIVER')),
    ('643844', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'), (SELECT id FROM gps.professions WHERE name = 'Укладчик-упаковщик'), (SELECT id FROM gps.grades WHERE grade_code = '3'), (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'), (SELECT id FROM gps.roles WHERE name = 'PACKER')),
    ('643849', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'), (SELECT id FROM gps.professions WHERE name = 'Укладчик-упаковщик ЛУМ'), (SELECT id FROM gps.grades WHERE grade_code = '3'), (SELECT id FROM gps.schedules WHERE schedule_code = '2'), (SELECT id FROM gps.roles WHERE name = 'UNIT_PACKER')),
    ('643845', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'), (SELECT id FROM gps.professions WHERE name = 'Штабелировщик металла'), (SELECT id FROM gps.grades WHERE grade_code = '3'), (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'), (SELECT id FROM gps.roles WHERE name = 'STACKER')),
    ('643857', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'), (SELECT id FROM gps.professions WHERE name = 'Резчик холодного металла'), (SELECT id FROM gps.grades WHERE grade_code = '3'), (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'), (SELECT id FROM gps.roles WHERE name = 'CUTTER'))
EOSQL