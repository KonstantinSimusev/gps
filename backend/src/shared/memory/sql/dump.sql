psql -v ON_ERROR_STOP=1 postgresql://student:password@localhost:5432/gps <<-EOSQL
  DROP TABLE gps.employee_roles;
  DROP TABLE gps.employees; 
  DROP TABLE gps.positions;
  DROP TABLE gps.workshops;
  DROP TABLE gps.professions;
  DROP TABLE gps.grades;
  DROP TABLE gps.schedules;
  DROP TABLE gps.roles;
  DROP TABLE gps.teams;
  DROP TABLE gps.accounts;
EOSQL

psql -v ON_ERROR_STOP=1 postgresql://student:password@localhost:5432/gps <<-EOSQL
  -- Создание таблицы accounts
  CREATE TABLE IF NOT EXISTS gps.accounts (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(512) NOT NULL,
    hashed_refresh_token VARCHAR(512)
  );

  -- Создание таблицы teams
  CREATE TABLE IF NOT EXISTS gps.teams (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    team_number VARCHAR(1) NOT NULL UNIQUE
  );

  -- Создание таблицы workshops
  CREATE TABLE IF NOT EXISTS gps.workshops (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    workshop_code VARCHAR(100) NOT NULL UNIQUE
  );

  -- Создание таблицы professions
  CREATE TABLE IF NOT EXISTS gps.professions (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
  );

  -- Создание таблицы grades
  CREATE TABLE IF NOT EXISTS gps.grades (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    grade_code VARCHAR(10) NOT NULL UNIQUE
  );

  -- Создание таблицы schedules
  CREATE TABLE IF NOT EXISTS gps.schedules (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    schedule_code VARCHAR(20) NOT NULL UNIQUE
  );

  -- Создание таблицы roles
  CREATE TABLE IF NOT EXISTS gps.roles (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
  );

  -- Создание таблицы positions
  CREATE TABLE IF NOT EXISTS gps.positions (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
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
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    patronymic VARCHAR(40) NOT NULL,
    personal_number VARCHAR(10) NOT NULL UNIQUE,
    birth_day DATE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    position_id UUID NOT NULL,
    team_id UUID NOT NULL,
    account_id UUID UNIQUE NOT NULL,

    CONSTRAINT unique_person_full_name UNIQUE (last_name, first_name, patronymic),

    CONSTRAINT fk__position FOREIGN KEY (position_id) REFERENCES gps.positions(id),
    CONSTRAINT fk__team FOREIGN KEY (team_id) REFERENCES gps.teams(id),
    CONSTRAINT fk__account FOREIGN KEY (account_id) REFERENCES gps.accounts(id)
  );

  -- Создание таблицы employee_roles
  CREATE TABLE IF NOT EXISTS gps.employee_roles (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    role_id UUID NOT NULL,
    employee_id UUID NOT NULL,

    CONSTRAINT fk__employee_role_role FOREIGN KEY (role_id) REFERENCES gps.roles(id),
    CONSTRAINT fk__employee_role_employee FOREIGN KEY (employee_id) REFERENCES gps.employees(id)
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
  INSERT INTO gps.schedules (schedule_code)
  VALUES
    ('5-Б-1'),
    ('2-А'),
    ('9'),
    ('2');

  -- Вставляем роли в таблицу
  INSERT INTO gps.roles (name)
  VALUES
    ('ADMIN'), -- Администратор
    ('DIRECTOR'), -- Директор
    ('PRODUCTION_MANAGER'), -- Начальник производства (в промышленности)
    ('SENIOR_MANAGER'), -- Старший менеджер
    ('MECHANIC'), -- Механик
    ('ENERGETICIST'), -- Энергетик
    ('LEAD_OHS_SPECIALIST'), -- Ведущий специалист по охране труда
    ('LEAD_ENGINEER'), -- Ведущий инженер
    ('QUALITY_ENGINEER'), -- Ведущий инженер по качеству
    ('OHS_SPECIALIST'), -- Специалист по охране труда
    ('PRODUCTION_ENGINEER'), -- Инженер по подготовке производства первой категории
    ('INSPECTOR_CLERK'), -- Инспектор‑делопроизводитель
    ('WORK_DISTRIBUTOR'), -- Распределитель работ
    ('LEAD_ECONOMIST'), -- Ведущий экономист
    ('LABOR_ENGINEER'), -- Ведущий инженер по организации и нормированию труда
    ('TECHNOLOGIST_ENGINEER'), -- Инженер по организации и нормированию труда первой категории
    ('LEAD_SPECIALIST'), -- Ведущий специалист
    ('SENIOR_TECHNOLOGIST'), -- Ведущий инженер‑технолог
    ('FIRST_ENGINEER'), -- Инженер‑технолог первой категории
    ('SECTION_HEAD'), -- Начальник участка (в промышленности)
    ('SECTION_MASTER'), -- Мастер участка
    ('BRIGADE_LEADER'), -- Бригадир на участках основного производства
    ('FINISHING_LEADER'), -- Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции
    ('PACKER'), -- Укладчик‑упаковщик
    ('LUM_PACKER'), -- Укладчик‑упаковщик
    ('REPAIR_MECHANIC'), -- Слесарь‑ремонтник
    ('METAL_STACKER'), -- Штабелировщик металла
    ('STAMPER'), -- Штамповщик
    ('FORKLIFT_DRIVER'), -- Водитель погрузчика
    ('COLD_CUTTER'), -- Резчик холодного металла
    ('SENIOR_MASTER'), -- Старший мастер участка
    ('FLAME_CUTTER'), -- Газорезчик
    ('CRANE_OPERATOR'), -- Машинист крана
    ('AUTOMATION_ENGINEER'), -- Ведущий инженер по автоматизации и механизации производственных процессов
    ('CONTROL_OPERATOR'), -- Оператор поста управления
    ('ELECTRICAL_TECHNICIAN'), -- Электромонтёр по ремонту и обслуживанию электрооборудования
    ('MOVEMENT_LEADER'), -- Бригадир по перемещению сырья, полуфабрикатов и готовой продукции в процессе производства
    ('CRANEMAN'), -- Машинист крана (крановщик)
    ('SENIOR_STOREKEEPER'), -- Кладовщик (старший)
    ('CAR_DRIVER'), -- Водитель автомобиля
    ('STOREKEEPER'); -- Кладовщик

  -- Вставляем позиции в таблицу
  INSERT INTO gps.positions (position_code, workshop_id, profession_id, grade_id, schedule_id, role_id)
  VALUES
    ('643842',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Начальник участка (в промышленности)'),
      (SELECT id FROM gps.grades WHERE grade_code = '17'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.roles WHERE name = 'SECTION_HEAD')
    ),
    ('643850',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Мастер участка'),
      (SELECT id FROM gps.grades WHERE grade_code = '13'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.roles WHERE name = 'SECTION_MASTER')
    ),
    ('643843',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Мастер участка'),
      (SELECT id FROM gps.grades WHERE grade_code = '13'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.roles WHERE name = 'SECTION_MASTER')
    ),
    ('643843',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Мастер участка'),
      (SELECT id FROM gps.grades WHERE grade_code = '12'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.roles WHERE name = 'SECTION_MASTER')
    ),
    ('643852',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Бригадир на участках основного производства'),
      (SELECT id FROM gps.grades WHERE grade_code = '5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.roles WHERE name = 'BRIGADE_LEADER')
    ),
    ('643853',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Бригадир на участках основного производства'),
      (SELECT id FROM gps.grades WHERE grade_code = '5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.roles WHERE name = 'BRIGADE_LEADER')
    ),
    ('643847',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Оператор поста управления'),
      (SELECT id FROM gps.grades WHERE grade_code = '5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2'),
      (SELECT id FROM gps.roles WHERE name = 'CONTROL_OPERATOR')
    ),
    ('643848',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Оператор поста управления'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2'),
      (SELECT id FROM gps.roles WHERE name = 'CONTROL_OPERATOR')
    ),
    ('643985',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.roles WHERE name = 'FINISHING_LEADER')
    ),
    ('643984',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.roles WHERE name = 'FINISHING_LEADER')
    ),
    ('643854',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Водитель погрузчика'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.roles WHERE name = 'FORKLIFT_DRIVER')
    ),
    ('643856',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Водитель погрузчика'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.roles WHERE name = 'FORKLIFT_DRIVER')
    ),
    ('643844',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Укладчик-упаковщик'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.roles WHERE name = 'PACKER')
    ),
    ('643849',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Укладчик-упаковщик ЛУМ'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2'),
      (SELECT id FROM gps.roles WHERE name = 'LUM_PACKER')
    ),
    ('643845',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Штабелировщик металла'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.roles WHERE name = 'METAL_STACKER')
    ),
    ('643857',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Резчик холодного металла'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.roles WHERE name = 'COLD_CUTTER')
    )
  ON CONFLICT (position_code) DO NOTHING;
EOSQL