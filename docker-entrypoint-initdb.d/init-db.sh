#!/bin/bash
set -e

# Часть 1: Суперпользователь создает пользователя и БД
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE USER "$DB_USER" WITH PASSWORD '$DB_PASSWORD';
  CREATE DATABASE "$DB_NAME";
  GRANT ALL PRIVILEGES ON DATABASE "$DB_NAME" TO "$DB_USER";
EOSQL

# Часть 2: Суперпользователь настраивает владельца БД, схему, предоставляет права
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
  ALTER DATABASE "$DB_NAME" OWNER TO "$DB_USER";

  CREATE SCHEMA IF NOT EXISTS gps;
  ALTER SCHEMA gps OWNER TO "$DB_USER";

  GRANT ALL ON ALL TABLES IN SCHEMA gps TO "$DB_USER";
  GRANT ALL ON ALL SEQUENCES IN SCHEMA gps TO "$DB_USER";
  GRANT ALL ON ALL FUNCTIONS IN SCHEMA gps TO "$DB_USER";
EOSQL

# Часть 3: Подключение к созданной базе данных, DB_USER создает таблицы и расширения
psql -v ON_ERROR_STOP=1 --username "$DB_USER" --dbname "$DB_NAME" <<-EOSQL

  -- Создание расширения для работы с UUID
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA gps;

  -- Создание таблицы accounts (аккаунты)
  CREATE TABLE IF NOT EXISTS gps.accounts (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(512) NOT NULL,
    hashed_refresh_token VARCHAR(512)
  );

  -- Создание таблицы roles (роли)
  CREATE TABLE IF NOT EXISTS gps.roles (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
  );

  -- Создание таблицы professions (профессии)
  CREATE TABLE IF NOT EXISTS gps.professions (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    profession_code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL UNIQUE
  );

  -- Создание таблицы teams (бригады)
  CREATE TABLE IF NOT EXISTS gps.teams (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    team_number INTEGER NOT NULL UNIQUE
  );

  -- Создание таблицы workshops (цехи)
  CREATE TABLE IF NOT EXISTS gps.workshops (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    workshop_code VARCHAR(100) NOT NULL UNIQUE
  );

  -- Создание таблицы grades (разряды)
  CREATE TABLE IF NOT EXISTS gps.grades (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    grade_code INTEGER NOT NULL UNIQUE
  );

  -- Создание таблицы schedules (графики работы)
  CREATE TABLE IF NOT EXISTS gps.schedules (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    schedule_code VARCHAR(20) NOT NULL UNIQUE
  );

  -- Создание таблицы payment_systems (системы оплаты труда)
  CREATE TABLE IF NOT EXISTS gps.payment_systems (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    payment_code VARCHAR(10) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL
  );

  -- Создание таблицы rate_systems (системы ставок/коэффициентов)
  CREATE TABLE IF NOT EXISTS gps.rate_systems (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    rate_code VARCHAR(10) NOT NULL UNIQUE,
    rate_name VARCHAR(255) NOT NULL,
    rate_number DECIMAL(3,2) NOT NULL
  );

  -- Создание таблицы attendance_types (типы посещаемости)
  CREATE TABLE IF NOT EXISTS gps.attendance_types (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    attendance_code VARCHAR(10) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL
  );

  -- Создание таблицы document_types (типы документов)
  CREATE TABLE IF NOT EXISTS gps.document_types (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    document_type_code VARCHAR(20) NOT NULL UNIQUE,
    document_type_name VARCHAR(50) NOT NULL
  );

  -- Создание таблицы document_titles (заголовки документов)
  CREATE TABLE IF NOT EXISTS gps.document_titles (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    document_title_code VARCHAR(20) NOT NULL UNIQUE,
    document_title_name VARCHAR(100) NOT NULL
  );

  -- Создание таблицы document_reasons (причины документов)
  CREATE TABLE IF NOT EXISTS gps.document_reasons (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    document_reason_code VARCHAR(20) NOT NULL UNIQUE,
    document_reason_name VARCHAR(255) NOT NULL
  );

  -- Создание таблицы document_actions (действия документов)
  CREATE TABLE IF NOT EXISTS gps.document_actions (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    document_action_code VARCHAR(20) NOT NULL UNIQUE,
    document_action_name VARCHAR(100) NOT NULL
  );

  -- Создание таблицы document_payments (типы доплат документов)
  CREATE TABLE IF NOT EXISTS gps.document_payments (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    document_payment_code VARCHAR(20) NOT NULL UNIQUE,
    document_payment_name VARCHAR(100) NOT NULL
  );

  -- Создание таблицы shift_types (типы смены)
  CREATE TABLE IF NOT EXISTS gps.shift_types (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    shift_code INTEGER NOT NULL UNIQUE
  );

  -- Создание таблицы notice_categories (категории уведомлений)
  CREATE TABLE IF NOT EXISTS gps.notice_categories (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    category_code VARCHAR(50) NOT NULL UNIQUE
  );

  -- Создание таблицы notice_actions (действия уведомлений)
  CREATE TABLE IF NOT EXISTS gps.notice_actions (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    action_code  VARCHAR(50) NOT NULL UNIQUE,
    action_label VARCHAR(50) NOT NULL
  );

  -- Создание таблицы notice_statuses (статусы уведомлений)
  CREATE TABLE IF NOT EXISTS gps.notice_statuses (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    status_label VARCHAR(50) NOT NULL UNIQUE
  );

  -- Создание таблицы notice_titles (заголовки уведомлений)
  CREATE TABLE IF NOT EXISTS gps.notice_titles (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    title_text VARCHAR(50) NOT NULL,

    category_id UUID NOT NULL,
    action_id UUID NOT NULL,
    status_id UUID NOT NULL,

    CONSTRAINT uq_notice_title UNIQUE (category_id, action_id, status_id, title_text),

    CONSTRAINT fk__title_category FOREIGN KEY (category_id) REFERENCES gps.notice_categories(id),
    CONSTRAINT fk__title_action FOREIGN KEY (action_id) REFERENCES gps.notice_actions(id),
    CONSTRAINT fk__title_status FOREIGN KEY (status_id) REFERENCES gps.notice_statuses(id)
  );

  -- Создание таблицы access_points (КПП)
  CREATE TABLE IF NOT EXISTS gps.access_points (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    point_code INTEGER NOT NULL,
    name VARCHAR(50) NOT NULL,
    entry_time INTEGER NULL,
    exit_time INTEGER NULL,

    workshop_id UUID NOT NULL,

    CONSTRAINT uq__access_point__code UNIQUE (point_code),
    CONSTRAINT fk__access_point_workshop FOREIGN KEY (workshop_id) REFERENCES gps.workshops(id)
  );

  -- Создание таблицы positions (штатные позиции)
  CREATE TABLE IF NOT EXISTS gps.positions (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    position_code INTEGER NOT NULL,

    workshop_id UUID NOT NULL,
    profession_id UUID NOT NULL,
    grade_id UUID NOT NULL,
    schedule_id UUID NOT NULL,
    role_id UUID NOT NULL,
    payment_system_id UUID NOT NULL,
    rate_system_id UUID NULL,

    CONSTRAINT uq_position_code_schedule_grade_payment_system UNIQUE (position_code, schedule_id, grade_id, payment_system_id),

    CONSTRAINT fk__position_workshop FOREIGN KEY (workshop_id) REFERENCES gps.workshops(id),
    CONSTRAINT fk__position_profession FOREIGN KEY (profession_id) REFERENCES gps.professions(id),
    CONSTRAINT fk__position_grade FOREIGN KEY (grade_id) REFERENCES gps.grades(id),
    CONSTRAINT fk__position_schedule FOREIGN KEY (schedule_id) REFERENCES gps.schedules(id),
    CONSTRAINT fk__position_role FOREIGN KEY (role_id) REFERENCES gps.roles(id),
    CONSTRAINT fk__position_payment_system FOREIGN KEY (payment_system_id) REFERENCES gps.payment_systems(id),
    CONSTRAINT fk__position_rate_system FOREIGN KEY (rate_system_id) REFERENCES gps.rate_systems(id)
  );

  -- Создание таблицы employees (сотрудники)
  CREATE TABLE IF NOT EXISTS gps.employees (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    patronymic VARCHAR(50) NOT NULL,
    personal_number INTEGER NOT NULL UNIQUE,
    birth_day DATE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    has_access BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    account_id UUID UNIQUE NOT NULL,
    team_id UUID NOT NULL,
    position_id UUID NOT NULL,
    profile_team_id UUID NOT NULL,
    profile_position_id UUID NOT NULL,

    CONSTRAINT uq_person_full_name UNIQUE (last_name, first_name, patronymic),

    CONSTRAINT fk__employee_account FOREIGN KEY (account_id) REFERENCES gps.accounts(id) ON DELETE CASCADE,
    CONSTRAINT fk__employee_team FOREIGN KEY (team_id) REFERENCES gps.teams(id),
    CONSTRAINT fk__employee_position FOREIGN KEY (position_id) REFERENCES gps.positions(id),
    CONSTRAINT fk__employee_profile_team FOREIGN KEY (profile_team_id) REFERENCES gps.teams(id),
    CONSTRAINT fk__employee_profile_position FOREIGN KEY (profile_position_id) REFERENCES gps.positions(id)
  );

  -- Создание таблицы work_places (рабочие места)
  CREATE TABLE IF NOT EXISTS gps.work_places (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,

    workshop_id UUID NOT NULL,
    profession_id UUID NOT NULL,

    CONSTRAINT fk__work_place_workshop FOREIGN KEY (workshop_id) REFERENCES gps.workshops(id),
    CONSTRAINT fk__work_place_profession FOREIGN KEY (profession_id) REFERENCES gps.professions(id)
  );

  -- Создание таблицы shift_schedules (расписания смен)
  CREATE TABLE IF NOT EXISTS gps.shift_schedules (
    id UUID DEFAULT gps.uuid_generate_v4() PRIMARY KEY,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    lunch_start TIME,
    lunch_end TIME,

    workshop_id UUID NOT NULL,
    schedule_id UUID NOT NULL,
    shift_type_id UUID NOT NULL,

    CONSTRAINT uq_shift_schedules_rule UNIQUE (workshop_id, schedule_id, day_of_week, shift_type_id),

    CONSTRAINT fk__shift_schedule_workshop FOREIGN KEY (workshop_id) REFERENCES gps.workshops(id),
    CONSTRAINT fk__shift_schedule_schedule FOREIGN KEY (schedule_id) REFERENCES gps.schedules(id),
    CONSTRAINT fk__shift_schedule_shift_type FOREIGN KEY (shift_type_id) REFERENCES gps.shift_types(id)
  );

  -- Создание таблицы shifts (смены)
  CREATE TABLE IF NOT EXISTS gps.shifts (
    id UUID DEFAULT gps.uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL,

    workshop_id UUID NOT NULL,
    team_id UUID NOT NULL,
    schedule_id UUID NOT NULL,
    shift_schedule_id UUID,

    CONSTRAINT uq_shift_date_workshop_team_schedule UNIQUE (date, workshop_id, team_id, schedule_id),

    CONSTRAINT fk__shift_workshop FOREIGN KEY (workshop_id) REFERENCES gps.workshops(id),
    CONSTRAINT fk__shift_team FOREIGN KEY (team_id) REFERENCES gps.teams(id),
    CONSTRAINT fk__shift_schedule FOREIGN KEY (schedule_id) REFERENCES gps.schedules(id),
    CONSTRAINT fk__shift_shift_schedule FOREIGN KEY (shift_schedule_id) REFERENCES gps.shift_schedules(id)
  );

  -- Создание таблицы documents (приказы, распоряжения, акты, заявления)
  CREATE TABLE IF NOT EXISTS gps.documents (
    id UUID DEFAULT gps.uuid_generate_v4() PRIMARY KEY,
    document_start_date DATE NOT NULL,
    document_end_date DATE NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    document_type_id UUID NOT NULL,
    document_title_id UUID NOT NULL,
    document_reason_id UUID NOT NULL,
    document_action_id UUID NOT NULL,
    
    workshop_id UUID NOT NULL,
    team_id UUID NOT NULL,
    schedule_id UUID NOT NULL,
    absent_employee_id UUID NULL,

    CONSTRAINT fk__document_document_type FOREIGN KEY (document_type_id) REFERENCES gps.document_types(id),
    CONSTRAINT fk__document_document_title FOREIGN KEY (document_title_id) REFERENCES gps.document_titles(id),
    CONSTRAINT fk__document_document_reason FOREIGN KEY (document_reason_id) REFERENCES gps.document_reasons(id),
    CONSTRAINT fk__document_document_action FOREIGN KEY (document_action_id) REFERENCES gps.document_actions(id),

    CONSTRAINT fk__document_workshop FOREIGN KEY (workshop_id) REFERENCES gps.workshops(id),
    CONSTRAINT fk__document_team FOREIGN KEY (team_id) REFERENCES gps.teams(id),
    CONSTRAINT fk__document_schedule FOREIGN KEY (schedule_id) REFERENCES gps.schedules(id),
    CONSTRAINT fk__document_absent_employee FOREIGN KEY (absent_employee_id) REFERENCES gps.employees(id)
  );

  -- Создание таблицы employee_shifts (смены сотрудников)
  CREATE TABLE IF NOT EXISTS gps.employee_shifts (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    minutes INTEGER NOT NULL DEFAULT 0,
    is_present BOOLEAN NULL,
    is_ready BOOLEAN NOT NULL,

    employee_id UUID NOT NULL,
    shift_id UUID NOT NULL,
    current_position_id UUID NOT NULL,
    attendance_type_id UUID NOT NULL,
    work_place_id UUID NULL,
    document_id UUID NULL,

    CONSTRAINT uq__employee_shift UNIQUE (employee_id, shift_id),

    CONSTRAINT fk__employee_shift_employee FOREIGN KEY (employee_id) REFERENCES gps.employees(id),
    CONSTRAINT fk__employee_shift_shift FOREIGN KEY (shift_id) REFERENCES gps.shifts(id),
    CONSTRAINT fk__employee_current_position FOREIGN KEY (current_position_id) REFERENCES gps.positions(id),
    CONSTRAINT fk__employee_shift_attendance_type FOREIGN KEY (attendance_type_id) REFERENCES gps.attendance_types(id),
    CONSTRAINT fk__employee_shift_work_place FOREIGN KEY (work_place_id) REFERENCES gps.work_places(id),
    CONSTRAINT fk__employee_shift_document FOREIGN KEY (document_id) REFERENCES gps.documents(id)
  );

  -- Создание таблицы notices (уведомления)
  CREATE TABLE IF NOT EXISTS gps.notices (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    source_id UUID,
    source_date DATE,
    is_unread BOOLEAN NOT NULL DEFAULT TRUE,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    notice_title_id UUID NOT NULL,
    workshop_id UUID NOT NULL,
    team_id UUID NOT NULL,
    schedule_id UUID NOT NULL,

    CONSTRAINT fk__notice_title FOREIGN KEY (notice_title_id) REFERENCES gps.notice_titles(id),   
    CONSTRAINT fk__notice_workshop FOREIGN KEY (workshop_id) REFERENCES gps.workshops(id),
    CONSTRAINT fk__notice_team FOREIGN KEY (team_id) REFERENCES gps.teams(id),   
    CONSTRAINT fk__notice_schedule FOREIGN KEY (schedule_id) REFERENCES gps.schedules(id)
  );

  -- Уникальность для уведомлений по дате (отсутствующие смены)
  CREATE UNIQUE INDEX IF NOT EXISTS uq_notices_source_date
    ON gps.notices (source_date, notice_title_id, workshop_id, team_id, schedule_id)
    WHERE source_date IS NOT NULL;
    
  -- Уникальность для уведомлений по sourceId (незаполненные смены)
  CREATE UNIQUE INDEX IF NOT EXISTS uq_notices_source_id
    ON gps.notices (source_id, notice_title_id, workshop_id, team_id, schedule_id)
    WHERE source_id IS NOT NULL;

  -- Вставляем категории уведомлений (shift — смены, document — документы)
  INSERT INTO gps.notice_categories (category_code)
  VALUES
    ('shift'), -- Категория «Смены» (табель, графики и т.п.)
    ('document'); -- Категория «Документы» (приказы, акты, распоряжения)

  -- Вставляем действия уведомлений
  INSERT INTO gps.notice_actions (action_code, action_label)
  VALUES
    ('create', 'Создать смену'),
    ('fill', 'Заполнить смену'),
    ('sign', 'Подписать документ');
  
  -- Вставляем статусы уведомлений
  INSERT INTO gps.notice_statuses (status_label)
  VALUES
    ('Смена не создана'),
    ('Смена не заполнена'),
    ('Документ не подписан');

  -- Вставляем заголовки уведомлений
  INSERT INTO gps.notice_titles (title_text, category_id, action_id, status_id)
  VALUES
    ('Табель',
      (SELECT id FROM gps.notice_categories WHERE category_code = 'shift'),
      (SELECT id FROM gps.notice_actions WHERE action_code = 'create'),
      (SELECT id FROM gps.notice_statuses WHERE status_label = 'Смена не создана')),
    ('Табель',
      (SELECT id FROM gps.notice_categories WHERE category_code = 'shift'),
      (SELECT id FROM gps.notice_actions WHERE action_code = 'fill'),
      (SELECT id FROM gps.notice_statuses WHERE status_label = 'Смена не заполнена')),
    ('Приказ',
      (SELECT id FROM gps.notice_categories WHERE category_code = 'document'),
      (SELECT id FROM gps.notice_actions WHERE action_code = 'sign'),
      (SELECT id FROM gps.notice_statuses WHERE status_label = 'Документ не подписан')),
    ('Распоряжение',
      (SELECT id FROM gps.notice_categories WHERE category_code = 'document'),
      (SELECT id FROM gps.notice_actions WHERE action_code = 'sign'),
      (SELECT id FROM gps.notice_statuses WHERE status_label = 'Документ не подписан')),
    ('Акт',
      (SELECT id FROM gps.notice_categories WHERE category_code = 'document'),
      (SELECT id FROM gps.notice_actions WHERE action_code = 'sign'),
      (SELECT id FROM gps.notice_statuses WHERE status_label = 'Документ не подписан')),
    ('Заявление',
      (SELECT id FROM gps.notice_categories WHERE category_code = 'document'),
      (SELECT id FROM gps.notice_actions WHERE action_code = 'sign'),
      (SELECT id FROM gps.notice_statuses WHERE status_label = 'Документ не подписан'));

  -- Вставляем роли в таблицу
  INSERT INTO gps.roles (name)
  VALUES
    ('USER'), -- Пользователь
    ('ADMIN'), -- Администратор
    ('EXECUTIVE'), -- Директор
    ('HEAD_PRODUCTION'), -- Начальник производства (в промышленности)
    ('SENIOR_MANAGER'), -- Старший менеджер
    ('MECHANIC'), -- Механик
    ('POWER_ENGINEER'), -- Энергетик
    ('LEAD_SAFETY'), -- Ведущий специалист по охране труда
    ('LEAD_ENGINEER'), -- Ведущий инженер
    ('LEAD_QUALITY'), -- Ведущий инженер по качеству
    ('SAFETY_SPECIALIST'), -- Специалист по охране труда
    ('PRODUCTION_ENGINEER'), -- Инженер по подготовке производства первой категории
    ('ADMIN_INSPECTOR'), -- Инспектор-делопроизводитель
    ('WORK_DISTRIBUTOR'), -- Распределитель работ
    ('LEAD_ECONOMIST'), -- Ведущий экономист
    ('LEAD_LABOR_ENGINEER'), -- Ведущий инженер по организации и нормированию труда
    ('LABOR_ENGINEER'), -- Инженер по организации и нормированию труда первой категории
    ('LEAD_SPECIALIST'), -- Ведущий специалист
    ('TECHNOLOGIST_LEAD'), -- Ведущий инженер-технолог
    ('TECHNOLOGIST'), -- Инженер-технолог первой категории
    ('ENGINEER'), -- Инженер первой категории
    ('HEAD'), -- Начальник участка (в промышленности)
    ('LEAD_MASTER'), -- Старший мастер участка
    ('DETAIL_MASTER'), -- Мастер участка реквизитов
    ('MASTER'), -- Мастер участка
    ('LEAD_OPERATOR'), -- Оператор поста управления (старший)
    ('OPERATOR'), -- Оператор поста управления
    ('PRODUCTION_FOREMAN'), -- Бригадир на участках основного производства
    ('PACKING_FOREMAN'), -- Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции
    ('PACKER'), -- Укладчик-упаковщик
    ('UNIT_PACKER'), -- Укладчик-упаковщик ЛУМ
    ('REPAIR_MECHANIC'), -- Слесарь-ремонтник
    ('STACKER'), -- Штабелировщик металла
    ('STAMPER'), -- Штамповщик
    ('DRIVER'), -- Водитель погрузчика
    ('CUTTER'), -- Резчик холодного металла
    ('GAS_CUTTER'), -- Газорезчик
    ('CRANE_OPERATOR'), -- Машинист крана
    ('LEAD_AUTOMATION'), -- Ведущий инженер по автоматизации и механизации производственных процессов
    ('ELECTRICIAN'), -- Электромонтёр по ремонту и обслуживанию электрооборудования
    ('MATERIAL_FOREMAN'), -- Бригадир по перемещению сырья, полуфабрикатов и готовой продукции в процессе производства
    ('CAR_DRIVER'), -- Водитель автомобиля
    ('SENIOR_WAREHOUSEMAN'), -- Кладовщик (старший)
    ('WAREHOUSEMAN'); -- Кладовщик

  -- Вставляем профессии в таблицу
  INSERT INTO gps.professions (profession_code, name)
  VALUES
    ('EXECUTIVE', 'Директор'),
    ('HEAD_PRODUCTION', 'Начальник производства (в промышленности)'),
    ('SENIOR_MANAGER', 'Старший менеджер'),
    ('MECHANIC', 'Механик'),
    ('POWER_ENGINEER', 'Энергетик'),
    ('LEAD_SAFETY', 'Ведущий специалист по охране труда'),
    ('LEAD_ENGINEER', 'Ведущий инженер'),
    ('LEAD_QUALITY', 'Ведущий инженер по качеству'),
    ('SAFETY_SPECIALIST', 'Специалист по охране труда'),
    ('PRODUCTION_ENGINEER', 'Инженер по подготовке производства первой категории'),
    ('ADMIN_INSPECTOR', 'Инспектор-делопроизводитель'),
    ('WORK_DISTRIBUTOR', 'Распределитель работ'),
    ('LEAD_ECONOMIST', 'Ведущий экономист'),
    ('LEAD_LABOR_ENGINEER', 'Ведущий инженер по организации и нормированию труда'),
    ('LABOR_ENGINEER', 'Инженер по организации и нормированию труда первой категории'),
    ('LEAD_SPECIALIST', 'Ведущий специалист'),
    ('TECHNOLOGIST_LEAD', 'Ведущий инженер-технолог'),
    ('TECHNOLOGIST', 'Инженер-технолог первой категории'),
    ('ENGINEER', 'Инженер первой категории'),
    ('HEAD', 'Начальник участка (в промышленности)'),
    ('MASTER', 'Мастер участка'),
    ('LEAD_MASTER', 'Старший мастер участка'),
    ('DETAIL_MASTER', 'Мастер участка реквизитов'),
    ('PRODUCTION_FOREMAN', 'Бригадир на участках основного производства'),
    ('PACKING_FOREMAN', 'Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции'),
    ('PACKER', 'Укладчик-упаковщик'),
    ('UNIT_PACKER', 'Укладчик-упаковщик ЛУМ'),
    ('PACKER_APR8', 'Укладчик-упаковщик АПР-8'),
    ('REPAIR_MECHANIC', 'Слесарь-ремонтник'),
    ('STACKER', 'Штабелировщик металла'),
    ('STAMPER', 'Штамповщик'),
    ('DRIVER', 'Водитель погрузчика'),
    ('CUTTER', 'Резчик холодного металла'),
    ('GAS_CUTTER', 'Газорезчик'),
    ('CRANE_OPERATOR', 'Машинист крана'),
    ('LEAD_AUTOMATION', 'Ведущий инженер по автоматизации и механизации производственных процессов'),
    ('LEAD_OPERATOR', 'Оператор поста управления (старший)'),
    ('OPERATOR', 'Оператор поста управления'),
    ('ELECTRICIAN', 'Электромонтёр по ремонту и обслуживанию электрооборудования'),
    ('MATERIAL_FOREMAN', 'Бригадир по перемещению сырья, полуфабрикатов и готовой продукции в процессе производства'),
    ('CAR_DRIVER', 'Водитель автомобиля'),
    ('SENIOR_WAREHOUSEMAN', 'Кладовщик (старший)'),
    ('WAREHOUSEMAN', 'Кладовщик');

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
    ('ЛПЦ-8 (участок гнутого профиля)'),
    ('ЛПЦ-8 (участок ленты)'),
    ('ЛПЦ-10'),
    ('ЛПЦ-11'),
    ('ПМП (южный блок)'),
    ('ПМП (северный блок)');

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

  -- Вставляем типы посещаемости в таблицу attendance_types
  INSERT INTO gps.attendance_types (attendance_code, description)
  VALUES
    ('БР1', 'Бригада №1'),
    ('БР2', 'Бригада №2'),
    ('БР3', 'Бригада №3'),
    ('БР4', 'Бригада №4'),
    ('БР5', 'Бригада №5'),
    ('Л4', 'ЛПЦ-4'),
    ('Л5', 'ЛПЦ-5'),
    ('Л8Г', 'ЛПЦ-8 (участок гнутого профиля)'),
    ('Л8Л', 'ЛПЦ-8 (участок ленты)'),
    ('Л10', 'ЛПЦ-10'),
    ('Л11', 'ЛПЦ-11'),
    ('ПМПЮ', 'ПМП (южный блок)'),
    ('ПМПС', 'ПМП (северный блок)'),
    ('А', 'Арест или задержания за правонарушения'),
    ('Б', 'Временная нетрудоспособность и отпуска по уходу за больными, оформленные листками нетрудоспособности'),
    ('БЖ', 'Освобождение женщины от работы в связи с беременностью'),
    ('БЖЧ', 'Сокращение рабочей смены беременным женщинам (в часах)'),
    ('В', 'Выходные и праздничные дни'),
    ('ВЗ', 'Время работы водолаза под водой'),
    ('ВП', 'Целые сменные и внутрисменные простои по причинам, не зависящим от работодателя и работника'),
    ('ВПА', 'Целые сменные и внутрисменные простои по вине работодателя'),
    ('ВПП', 'Целосменные и внутресменные простои по причинам, не зависящим от работодателя и работника (более 2/3 тарифа)'),
    ('ВПР', 'Целые сменные и внутрисменные простои по вине работника'),
    ('ГИА', 'Работа в газоизолирующих аппаратах'),
    ('ГС', 'Целодневные невыходы с полным сохранением заработной платы в случаях, предусмотренных законодательством'),
    ('ГЧ', 'Нецелодневные (часовые) невыходы с сохранением заработной платы в случаях, предусмотренных законодательством'),
    ('Д', 'Донорский день'),
    ('ДД', 'Другой день отдыха'),
    ('ДИ', 'Нерабочий день с сохранением заработной платы'),
    ('ДНД', 'Дополнительный нерабочий день после дня проведения вакцинации'),
    ('ДО', 'Время прохождения диспансеризации'),
    ('ДСР', 'Время работы с доплатой до среднего заработка'),
    ('ДУ', 'Обучение с использованием дистанционных технологий'),
    ('ЗБ', 'Массовые неявки - забастовки (разрешенные законом)'),
    ('К', 'Служебные командировки'),
    ('КО', 'Компенсация за неиспользованные дни ежегодного отпуска при увольнении работника'),
    ('КОТ', 'Кратковременный целосменный отпуск с последующей отработкой'),
    ('КОЧ', 'Кратковременный нецелосменный отпуск с последующей отработкой'),
    ('КУ', 'Направление на обучение'),
    ('КУВ', 'Направление на обучение (часовое во время работы)'),
    ('КУД', 'Направление на обучение (дополнительно к часам работы)'),
    ('ЛА', 'Ликвидация аварии'),
    ('М', 'Перерывы для кормления ребенка'),
    ('МО', 'Медицинский осмотр (обследование) в Диагностическом центре'),
    ('НБ', 'Целосменные невыходы: отпуска без сохранения заработной платы и неявки по уважительным причинам'),
    ('НД', 'Нерабочий праздничный день'),
    ('НН', 'Неявки по невыясненным причинам'),
    ('НС', 'Неотработанные часы'),
    ('ОА', 'Отпуск (оплачиваемый частично) по инициативе администрации в связи с простоем в организации'),
    ('ОД', 'Ежегодный дополнительный отпуск, предусмотренный законодательством и/или коллективным договором'),
    ('ОЖ', 'Отпуск по уходу за ребенком от 1,5 до 3-х лет'),
    ('ОИ', 'Дополнительные выходные дни работникам, осуществляющим уход за детьми-инвалидами'),
    ('ОЛ', 'Отпуск для лечения'),
    ('ОП', 'Доп.отпуск для профилактики проф.заболеваний'),
    ('ОРС', 'Целосменное время отстранения от работы работодателем (недопущение к работе)'),
    ('ОРЧ', 'Часовое время отстранения от работы работодателем (недопущение к работе)'),
    ('ОС', 'Отпуск социальный'),
    ('ОСР', 'Время работы с оплатой по среднему заработку'),
    ('ОТ', 'Ежегодный основной отпуск'),
    ('ОТД', 'Отработка кратковременного отпуска'),
    ('ОТР', 'Работа в выходной и/или нерабочий праздничный день с предоставлением другого дня отдыха'),
    ('ОТЧ', 'Часовое время отработки кратковременного отпуска'),
    ('ОУ', 'Отпуск уполномоченным по охране труда'),
    ('ОУТ', 'Доп. доплата за особые условия труда'),
    ('ОЧ', 'Частично оплачиваемый отпуск, предоставляемый по уходу за ребенком до достижения им возраста 1,5 лет'),
    ('П', 'Время в пути при выполнении работ вахтовым методом'),
    ('ПВ', 'Время вынужденного прогула'),
    ('ПМ', 'Периодический медицинский осмотр'),
    ('ПР', 'Прогулы; неявки на работу без уважительной причины, отсутствие на работе без уважительной причины более четырех часов'),
    ('ПТД', 'Приостановление действия трудового договора'),
    ('ПУ', 'Опоздание и/или преждевременный уход'),
    ('Р', 'Отпуск по беременности и родам'),
    ('РВ', 'Работа в выходной и/или нерабочий праздничный день вне графика'),
    ('РДЧ', 'Длительность перерыва при разделении рабочего дня на части'),
    ('РН', 'Работа в нерабочие дни'),
    ('С', 'Сверхурочные часы работы'),
    ('СД', 'Сокращенный рабочий день для женщин, не берущих частично оплачиваемый отпуск, предоставляемый по уходу за ребенком до достижения им возраста 1,5 лет'),
    ('СДН', 'Сокращенная рабочая неделя для женщин, не берущих частично оплачиваемый отпуск, предоставляемый по уходу за ребенком до достижения им возраста 1,5 лет'),
    ('СИ', 'Самоизоляция'),
    ('СН', 'Сокращенная неделя по личному заявлению'),
    ('СЧ', 'Сокращенный день по личному заявлению'),
    ('У', 'Отпуск в связи с обучением с полным сохранением заработной платы'),
    ('УД', 'Отпуск в связи с обучением без сохранения заработной платы'),
    ('УЧ', 'Отпуска в связи с обучением с частичным сохранением заработной платы (50%)'),
    ('ХС', 'Время работы сдельщиков за целые повременные смены (без премии)'),
    ('ХЧ', 'Время работы сдельщиков за нецелые повременные смены'),
    ('ЧИ', 'Дополнительные часы отдыха для работника-инвалида'),
    ('Я', 'Часы работы');

  -- Вставляем типы документов в таблицу document_types
  INSERT INTO gps.document_types (document_type_code, document_type_name)
  VALUES
    ('order', 'Приказ'),
    ('directive','Распоряжение'),
    ('act', 'Акт'),
    ('request', 'Заявление');

  -- Вставляем заголовки документов в таблицу document_titles
  INSERT INTO gps.document_titles (document_title_code, document_title_name)
  VALUES
    ('title_transfer', 'О переводе на другую работу'),
    ('title_relocation', 'О перемещении работника');

  -- Вставляем причины документов в таблицу document_reasons
  INSERT INTO gps.document_reasons (document_reason_code, document_reason_name)
  VALUES
    ('vacation', 'На период очередного оплачиваемого отпуска'),
    ('fix', 'Для раскрепления металлопродукции');

  -- Вставляем действия документов в таблицу document_actions
  INSERT INTO gps.document_actions (document_action_code, document_action_name)
  VALUES
    ('action_transfer', 'Перевести на другую работу'),
    ('action_relocate', 'Переместить в другую бригаду');

  -- Вставляем системы оплаты труда в таблицу payment_systems
  INSERT INTO gps.payment_systems (payment_code, description)
  VALUES
    ('РВ', 'Работа в выходной и/или нерабочий праздничный день вне графика'),
    ('ДСР', 'Время работы с доплатой до среднего заработка'),
    ('ОСР', 'Время работы с оплатой по среднему заработку'),
    ('ПП', 'Повременно-премиальная'),
    ('ППИ', 'Повременно-премиальная индивидуальная система оплаты'),
    ('КСП', 'Комбинированная система оплаты труда с премией на повременный и сдельный заработок'),
    ('СКП', 'Сдельная коллективная с премией на сдельный заработок'),
    ('СПИ', 'Сдельно-премиальная индивидуальная');

  -- Вставляем системы ставок/коэффициентов в таблицу rate_systems
  INSERT INTO gps.rate_systems (rate_code, rate_name, rate_number)
  VALUES
    ('ISO_1_14', 'ИСО, с повышающим коэффициентом 1,14', 1.14),
    ('ISO_1_20', 'ИСО, с повышающим коэффициентом 1,20', 1.20),
    ('ISO_1_29', 'ИСО, с повышающим коэффициентом 1,29', 1.29),
    ('ISO_1_35', 'ИСО, с повышающим коэффициентом 1,35', 1.35),
    ('ISO_1_36', 'ИСО, с повышающим коэффициентом 1,36', 1.36),
    ('ISO_1_38', 'ИСО, с повышающим коэффициентом 1,38', 1.38),
    ('ISO_1_50', 'ИСО, с повышающим коэффициентом 1,50', 1.50),
    ('ISO_1_89', 'ИСО, с повышающим коэффициентом 1,89', 1.89);

  -- Вставляем типы смен в таблицу shift_types
  INSERT INTO gps.shift_types (shift_code)
  VALUES
    (1),
    (2);

  -- Вставляем позиции в таблицу
  INSERT INTO gps.positions (position_code, workshop_id, profession_id, grade_id, schedule_id, payment_system_id, rate_system_id, role_id)
  VALUES
    -- ЛПЦ-5
    ('643776',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.professions WHERE profession_code = 'HEAD'),
      (SELECT id FROM gps.grades WHERE grade_code = '17'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'HEAD')),
    ('643795',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.professions WHERE profession_code = 'DETAIL_MASTER'),
      (SELECT id FROM gps.grades WHERE grade_code = '13'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'DETAIL_MASTER')),
    ('643777',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.professions WHERE profession_code = 'MASTER'),
      (SELECT id FROM gps.grades WHERE grade_code = '12'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'MASTER')),
    ('643799',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.professions WHERE profession_code = 'REPAIR_MECHANIC'),
      (SELECT id FROM gps.grades WHERE grade_code = '6'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'MECHANIC')),
    ('643796',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PRODUCTION_FOREMAN'),
      (SELECT id FROM gps.grades WHERE grade_code = '5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'PRODUCTION_FOREMAN')),
    ('643975',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKING_FOREMAN'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'PACKING_FOREMAN')),
    ('643800',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.professions WHERE profession_code = 'DRIVER'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'DRIVER')),
    ('643797',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.professions WHERE profession_code = 'STAMPER'),
      (SELECT id FROM gps.grades WHERE grade_code = '5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'STAMPER')),
    ('643779',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKER'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'PACKER')),
    ('643779',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKER'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'СПИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'PACKER')),
    ('643780',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.professions WHERE profession_code = 'STACKER'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'STACKER')),

    -- ЛПЦ-8 (участок гнутого профиля)
    ('643814',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок гнутого профиля)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'MASTER'),
      (SELECT id FROM gps.grades WHERE grade_code = '13'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'MASTER')),
    ('643814',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок гнутого профиля)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'MASTER'),
      (SELECT id FROM gps.grades WHERE grade_code = '12'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'MASTER')),
    ('643814',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок гнутого профиля)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'DETAIL_MASTER'),
      (SELECT id FROM gps.grades WHERE grade_code = '12'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'DETAIL_MASTER')),
    ('643814',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок гнутого профиля)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'DETAIL_MASTER'),
      (SELECT id FROM gps.grades WHERE grade_code = '13'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'DETAIL_MASTER')),
    ('643817',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок гнутого профиля)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PRODUCTION_FOREMAN'),
      (SELECT id FROM gps.grades WHERE grade_code = '5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'PRODUCTION_FOREMAN')),
    ('643982',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок гнутого профиля)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKING_FOREMAN'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'PACKING_FOREMAN')),
    ('643827',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок гнутого профиля)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'STACKER'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'STACKER')),

    -- ЛПЦ-8 (участок ленты)
    ('643812',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'HEAD'),
      (SELECT id FROM gps.grades WHERE grade_code = '17'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'HEAD')),
    ('643813',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'MASTER'),
      (SELECT id FROM gps.grades WHERE grade_code = '13'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'MASTER')),
    ('643813',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'MASTER'),
      (SELECT id FROM gps.grades WHERE grade_code = '12'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'MASTER')),
    ('643815',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'REPAIR_MECHANIC'),
      (SELECT id FROM gps.grades WHERE grade_code = '6'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'MECHANIC')),
    ('643816',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PRODUCTION_FOREMAN'),
      (SELECT id FROM gps.grades WHERE grade_code = '5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'PRODUCTION_FOREMAN')),
    ('643980',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKING_FOREMAN'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'PACKING_FOREMAN')),
    ('649930',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'DRIVER'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'DRIVER')),
    ('643981',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKING_FOREMAN'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'PACKING_FOREMAN')),
    ('647481',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKER_APR8'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'PACKER')),
    ('643825',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKER'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'СПИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'PACKER')),
    ('643825',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKER'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'PACKER')),
    ('643826',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'STACKER'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'STACKER')),
    ('643983',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.professions WHERE profession_code = 'CUTTER'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'CUTTER')),
    
    -- ЛПЦ-10
    ('643834',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-10'),
      (SELECT id FROM gps.professions WHERE profession_code = 'LEAD_MASTER'),
      (SELECT id FROM gps.grades WHERE grade_code = '15'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'LEAD_MASTER')),
    ('643835',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-10'),
      (SELECT id FROM gps.professions WHERE profession_code = 'MASTER'),
      (SELECT id FROM gps.grades WHERE grade_code = '12'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'MASTER')),
    ('643837',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-10'),
      (SELECT id FROM gps.professions WHERE profession_code = 'REPAIR_MECHANIC'),
      (SELECT id FROM gps.grades WHERE grade_code = '6'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'REPAIR_MECHANIC')),
    ('643838',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-10'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PRODUCTION_FOREMAN'),
      (SELECT id FROM gps.grades WHERE grade_code = '5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'PRODUCTION_FOREMAN')),
    ('643840',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-10'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKER'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'СКП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'PACKER')),
    ('643841',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-10'),
      (SELECT id FROM gps.professions WHERE profession_code = 'STACKER'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'STACKER')),
    
    -- ЛПЦ-11
    ('643842',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'HEAD'),
      (SELECT id FROM gps.grades WHERE grade_code = '15'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'HEAD')),
    ('643842',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'HEAD'),
      (SELECT id FROM gps.grades WHERE grade_code = '17'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'HEAD')),
    ('643850',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'DETAIL_MASTER'),
      (SELECT id FROM gps.grades WHERE grade_code = '13'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'DETAIL_MASTER')),
    ('643843',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'MASTER'),
      (SELECT id FROM gps.grades WHERE grade_code = '13'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'MASTER')),
    ('643843',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'MASTER'),
      (SELECT id FROM gps.grades WHERE grade_code = '12'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'MASTER')),
    ('643843',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'MASTER'),
      (SELECT id FROM gps.grades WHERE grade_code = '11'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ПП'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'MASTER')),
    ('643852',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PRODUCTION_FOREMAN'),
      (SELECT id FROM gps.grades WHERE grade_code = '5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      (SELECT id FROM gps.rate_systems WHERE rate_code = 'ISO_1_14'),
      (SELECT id FROM gps.roles WHERE name = 'PRODUCTION_FOREMAN')),
    ('643853',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PRODUCTION_FOREMAN'),
      (SELECT id FROM gps.grades WHERE grade_code = '5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      (SELECT id FROM gps.rate_systems WHERE rate_code = 'ISO_1_36'),
      (SELECT id FROM gps.roles WHERE name = 'PRODUCTION_FOREMAN')),
    ('643853',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PRODUCTION_FOREMAN'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'PRODUCTION_FOREMAN')),
    ('643847',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'LEAD_OPERATOR'),
      (SELECT id FROM gps.grades WHERE grade_code = '5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      (SELECT id FROM gps.rate_systems WHERE rate_code = 'ISO_1_14'),
      (SELECT id FROM gps.roles WHERE name = 'LEAD_OPERATOR')),
    ('643848',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'OPERATOR'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      (SELECT id FROM gps.rate_systems WHERE rate_code = 'ISO_1_20'),
      (SELECT id FROM gps.roles WHERE name = 'OPERATOR')),
    ('643985',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKING_FOREMAN'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      (SELECT id FROM gps.rate_systems WHERE rate_code = 'ISO_1_14'),
      (SELECT id FROM gps.roles WHERE name = 'PACKING_FOREMAN')),
    ('643984',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKING_FOREMAN'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      (SELECT id FROM gps.rate_systems WHERE rate_code = 'ISO_1_38'),
      (SELECT id FROM gps.roles WHERE name = 'PACKING_FOREMAN')),
    ('643854',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'DRIVER'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      (SELECT id FROM gps.rate_systems WHERE rate_code = 'ISO_1_29'),
      (SELECT id FROM gps.roles WHERE name = 'DRIVER')),
    ('643856',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'DRIVER'),
      (SELECT id FROM gps.grades WHERE grade_code = '4'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'DRIVER')),
    ('643844',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKER'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'СПИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'PACKER')),
    ('643844',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKER'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      NULL,
      (SELECT id FROM gps.roles WHERE name = 'PACKER')),
    ('643849',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'UNIT_PACKER'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      (SELECT id FROM gps.rate_systems WHERE rate_code = 'ISO_1_50'),
      (SELECT id FROM gps.roles WHERE name = 'UNIT_PACKER')),
    ('643845',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'STACKER'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'), 
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      (SELECT id FROM gps.rate_systems WHERE rate_code = 'ISO_1_89'),
      (SELECT id FROM gps.roles WHERE name = 'STACKER')),
    ('643857',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'CUTTER'),
      (SELECT id FROM gps.grades WHERE grade_code = '3'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.payment_systems WHERE payment_code = 'ППИ'),
      (SELECT id FROM gps.rate_systems WHERE rate_code = 'ISO_1_35'),
      (SELECT id FROM gps.roles WHERE name = 'CUTTER'));

  -- Вставляем данные в таблицу shift_schedules
  INSERT INTO gps.shift_schedules (day_of_week, start_time, end_time, lunch_start, lunch_end, workshop_id, schedule_id, shift_type_id)
  VALUES
    -- ЛПЦ-5
    -- График 5-Б-1
    -- Пн-Чт (дни 1-4): 02:00-10:45, обед 06:00-06:30, смена 2
    (1, '02:00', '10:45', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),
    (2, '02:00', '10:45', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),
    (3, '02:00', '10:45', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),
    (4, '02:00', '10:45', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- Пт (день 5): 02:00-09:30, обед 06:00-06:30, смена 2
    (5, '02:00', '09:30', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- График 2-А (универсальный, день 0)
    -- Дневная: 02:00-14:00, обед 08:30-09:00, смена 2
    (0, '02:00', '14:00', '08:30', '09:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- Ночная: 14:00-02:00 (пересекает полночь), обед 20:30-21:00, смена 1
    (0, '14:00', '02:00', '20:30', '21:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 1)),

    -- График 9-1 (универсальный, день 0)
    -- Дневная: 02:00-14:00, обед 07:00-08:00, смена 1
    (0, '02:00', '14:00', '07:00', '08:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 1)),

    -- График 9-2 (универсальный, день 0)
    -- Дневная: 02:00-14:00, обед 07:00-08:00, смена 2
    (0, '02:00', '14:00', '07:00', '08:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- ЛПЦ-8 (участок гнутого профиля)
    -- График 5-Б-1
    -- Пн-Чт (дни 1-4): 02:00-10:45, обед 06:00-06:30, смена 2
    (1, '02:00', '10:45', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок гнутого профиля)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),
    (2, '02:00', '10:45', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок гнутого профиля)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),
    (3, '02:00', '10:45', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок гнутого профиля)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),
    (4, '02:00', '10:45', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок гнутого профиля)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- Пт (день 5): 02:00-09:30, обед 06:00-06:30, смена 2
    (5, '02:00', '09:30', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок гнутого профиля)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- График 2-А (универсальный, день 0)
    -- Дневная: 02:30-14:30, обед 07:30-08:00, смена 2
    (0, '02:30', '14:30', '07:30', '08:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок гнутого профиля)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- Ночная: 14:30-02:30 (пересекает полночь), обед 19:30-20:00, смена 1
    (0, '14:30', '02:30', '19:30', '20:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок гнутого профиля)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 1)),

    -- График 9-1 (универсальный, день 0)
    -- Дневная: 02:00-14:00, обед 07:00-08:00, смена 1
    (0, '02:00', '14:00', '07:00', '08:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок гнутого профиля)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 1)),

    -- График 9-2 (универсальный, день 0)
    -- Дневная: 02:00-14:00, обед 07:00-08:00, смена 2
    (0, '02:00', '14:00', '07:00', '08:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок гнутого профиля)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- ЛПЦ-8 (участок ленты)
    -- График 5-Б-1
    -- Пн-Чт (дни 1-4): 02:00-10:45, обед 06:00-06:30, смена 2
    (1, '02:00', '10:45', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),
    (2, '02:00', '10:45', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),
    (3, '02:00', '10:45', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),
    (4, '02:00', '10:45', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- Пт (день 5): 02:00-09:30, обед 06:00-06:30, смена 2
    (5, '02:00', '09:30', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- График 2-А (универсальный, день 0)
    -- Дневная: 02:30-14:30, обед 07:30-08:00, смена 2
    (0, '02:30', '14:30', '07:30', '08:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- Ночная: 14:30-02:30 (пересекает полночь), обед 19:30-20:00, смена 1
    (0, '14:30', '02:30', '19:30', '20:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 1)),

    -- График 9-1 (универсальный, день 0)
    -- Дневная: 02:00-14:00, обед 07:00-08:00, смена 1
    (0, '02:00', '14:00', '07:00', '08:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 1)),

    -- График 9-2 (универсальный, день 0)
    -- Дневная: 02:00-14:00, обед 07:00-08:00, смена 2
    (0, '02:00', '14:00', '07:00', '08:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8 (участок ленты)'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- ЛПЦ-10
    -- График 5-Б-1
    -- Пн-Чт (дни 1-4): 03:00-11:45, обед 07:00-07:30, смена 2
    (1, '03:00', '11:45', '07:00', '07:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-10'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),
    (2, '03:00', '11:45', '07:00', '07:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-10'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),
    (3, '03:00', '11:45', '07:00', '07:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-10'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),
    (4, '03:00', '11:45', '07:00', '07:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-10'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- Пт (день 5): 03:00-10:30, обед 07:00-07:30, смена 2
    (5, '03:00', '10:30', '07:00', '07:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-10'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- График 2-А (универсальный, день 0)
    -- Дневная: 03:00-15:00, обед 08:30-09:00, смена 2
    (0, '03:00', '15:00', '08:30', '09:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-10'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- Ночная: 15:00-03:00 (пересекает полночь), обед 20:30-21:00, смена 1
    (0, '15:00', '03:00', '20:30', '21:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-10'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 1)),

    -- График 9-1 (универсальный, день 0)
    -- Дневная: 03:00-15:00, обед 08:00-09:00, смена 1
    (0, '03:00', '15:00', '08:00', '09:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-10'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 1)),

    -- График 9-2 (универсальный, день 0)
    -- Дневная: 03:00-15:00, обед 08:00-09:00, смена 2
    (0, '03:00', '15:00', '08:00', '09:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-10'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- ЛПЦ-11
    -- График 5-Б-1
    -- Пн-Чт (дни 1-4): 02:00-10:45, обед 06:00-06:30, смена 2
    (1, '02:00', '10:45', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),
    (2, '02:00', '10:45', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),
    (3, '02:00', '10:45', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),
    (4, '02:00', '10:45', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- Пт (день 5): 02:00-09:30, обед 06:00-06:30, смена 2
    (5, '02:00', '09:30', '06:00', '06:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- График 2-А (универсальный, день 0)
    -- Дневная: 02:30-14:30, обед 07:30-08:00, смена 2
    (0, '02:30', '14:30', '07:30', '08:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- Ночная: 14:30-02:30 (пересекает полночь), обед 19:30-20:00, смена 1
    (0, '14:30', '02:30', '19:30', '20:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 1)),

    -- График 2 (универсальный, день 0)
    -- Дневная: 02:30-14:30, обеда нет, смена 2
    (0, '02:30', '14:30', NULL, NULL,
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 2)),

    -- Ночная: 14:30-02:30 (пересекает полночь), обеда нет, смена 1
    (0, '14:30', '02:30', NULL, NULL,
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2'),
      (SELECT id FROM gps.shift_types WHERE shift_code = 1));

  -- Вставляем контрольно-пропускные пункты
  INSERT INTO gps.access_points (point_code, name, entry_time, exit_time, workshop_id)
  VALUES
    -- ЛПЦ-11
    (5, 'Проходная №5', 23, 27,
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11')),
    (11, 'Проходная №11', 31, 35,
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11')),
    (18, 'Проходная №18', 9, 13,
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11')),
    (61, 'Проходная №61', 19, 23,
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'));

  -- Вставляем данные в таблицу work_places (рабочие места)
  INSERT INTO gps.work_places (name, workshop_id, profession_id)
  VALUES
    ('ЛПЦ-11',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'HEAD')),
    ('ЛПЦ-11',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'MASTER')),
    ('ЛПЦ-11',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'DETAIL_MASTER')),
    ('ЛУМ',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'UNIT_PACKER')),
    ('ЛУМ',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'LEAD_OPERATOR')),
    ('ЛУМ',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'OPERATOR')),
    ('1 очередь: СТАН-2000',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKER')),
    ('2 очередь: АНГЦ + АНО-ГЦ + АИ',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKER')),
    ('3 очередь: АНГЦ-3',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKER')),
    ('Ж/д тупик 6',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'STACKER')),
    ('Ж/д тупик 7',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'STACKER')),
    ('Ж/д тупик 8',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'STACKER')),
    ('Ж/д тупик 10',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'STACKER')),
    ('Производство реквизитов',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKING_FOREMAN')),
    ('Производство реквизитов',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'DRIVER')),
    ('Производство реквизитов',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'CUTTER')),
    ('Документация',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PRODUCTION_FOREMAN')),
    ('Интвентаризация',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PRODUCTION_FOREMAN')),
    ('Обработка данных',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE profession_code = 'PACKING_FOREMAN'));
EOSQL