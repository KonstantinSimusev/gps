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
    id UUID DEFAULT gps.uuid_generate_v4 () NOT NULL PRIMARY KEY,
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
    schedule_code VARCHAR(20) NOT NULL UNIQUE,
    duration TIME NOT NULL
  );

  -- Создание таблицы attendance_types (типы посещаемости)
  CREATE TABLE IF NOT EXISTS gps.attendance_types (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    attendance_code VARCHAR(10) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL
  );

  -- Создание таблицы shift_types (типы смены)
  CREATE TABLE IF NOT EXISTS gps.shift_types (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(20) NOT NULL
  );

  -- Создание таблицы positions (штатные позиции)
  CREATE TABLE IF NOT EXISTS gps.positions (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    position_code INTEGER NOT NULL UNIQUE,

    workshop_id UUID NOT NULL,
    profession_id UUID NOT NULL,
    grade_id UUID NOT NULL,
    schedule_id UUID NOT NULL,
    role_id UUID NOT NULL,

    CONSTRAINT fk__position_workshop FOREIGN KEY (workshop_id) REFERENCES gps.workshops(id),
    CONSTRAINT fk__position_profession FOREIGN KEY (profession_id) REFERENCES gps.professions(id),
    CONSTRAINT fk__position_grade FOREIGN KEY (grade_id) REFERENCES gps.grades(id),
    CONSTRAINT fk__position_schedule FOREIGN KEY (schedule_id) REFERENCES gps.schedules(id),
    CONSTRAINT fk__position_role FOREIGN KEY (role_id) REFERENCES gps.roles(id)
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
    current_team_id UUID NULL,
    current_position_id UUID NULL,

    CONSTRAINT uq_person_full_name UNIQUE (last_name, first_name, patronymic),

    CONSTRAINT fk__employee_account FOREIGN KEY (account_id) REFERENCES gps.accounts(id) ON DELETE CASCADE,
    CONSTRAINT fk__employee_team FOREIGN KEY (team_id) REFERENCES gps.teams(id),
    CONSTRAINT fk__employee_position FOREIGN KEY (position_id) REFERENCES gps.positions(id),
    CONSTRAINT fk__employee_current_team FOREIGN KEY (current_team_id) REFERENCES gps.teams(id),
    CONSTRAINT fk__employee_current_position FOREIGN KEY (current_position_id) REFERENCES gps.positions(id)
  );

  -- Создание таблицы employee_roles (роли сотрудников)
  CREATE TABLE IF NOT EXISTS gps.employee_roles (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,

    role_id UUID NOT NULL,
    employee_id UUID NOT NULL,

    CONSTRAINT unique_employee_single_role UNIQUE (employee_id),

    CONSTRAINT fk__employee_role_role FOREIGN KEY (role_id) REFERENCES gps.roles(id),
    CONSTRAINT fk__employee_role_employee FOREIGN KEY (employee_id) REFERENCES gps.employees(id) ON DELETE CASCADE
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
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    workshop_id UUID NOT NULL,
    schedule_id UUID NOT NULL,
    shift_type_id UUID NOT NULL,

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
    shift_schedule_id UUID NOT NULL,

    CONSTRAINT uq_shift_workshop_date_team UNIQUE (workshop_id, date, team_id),
    CONSTRAINT uq_shift_workshop_date_schedule UNIQUE (workshop_id, date, shift_schedule_id),

    CONSTRAINT fk__shift_team FOREIGN KEY (team_id) REFERENCES gps.teams(id),
    CONSTRAINT fk__shift_shift_schedule FOREIGN KEY (shift_schedule_id) REFERENCES gps.shift_schedules(id)
  );

  -- Создание таблицы employee_shifts (смены сотрудников)
  CREATE TABLE IF NOT EXISTS gps.employee_shifts (
    id UUID DEFAULT gps.uuid_generate_v4() NOT NULL PRIMARY KEY,
    hours DECIMAL(4, 1) NOT NULL,

    employee_id UUID NOT NULL,
    shift_id UUID NOT NULL,
    attendance_type_id UUID NOT NULL,
    current_profession_id UUID NOT NULL,
    work_place_id UUID NOT NULL,

    CONSTRAINT uq__employee_shift UNIQUE (employee_id, shift_id),

    CONSTRAINT fk__employee_shift_employee FOREIGN KEY (employee_id) REFERENCES gps.employees(id),
    CONSTRAINT fk__employee_shift_shift FOREIGN KEY (shift_id) REFERENCES gps.shifts(id),
    CONSTRAINT fk__employee_shift_attendance_type FOREIGN KEY (attendance_type_id) REFERENCES gps.attendance_types(id),
    CONSTRAINT fk__employee_shift_current_profession FOREIGN KEY (current_profession_id) REFERENCES gps.professions(id),
    CONSTRAINT fk__employee_shift_work_place FOREIGN KEY (work_place_id) REFERENCES gps.work_places(id)
  );

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
    ('DETAIL_MASTER'), -- Мастер участка (реквизитов)
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

  -- Вставляем типы посещаемости в таблицу attendance_types
  INSERT INTO gps.attendance_types (attendance_code, description)
  VALUES
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

  -- Вставляем типы смен в таблицу shift_types
  INSERT INTO gps.shift_types (name, category)
  VALUES
    ('Смена 1', 'ночная'),
    ('Смена 2', 'дневная'),
    ('Бригада 1', 'дневная'),
    ('Бригада 2', 'дневная'),
    ('Понедельник', 'дневная'),
    ('Вторник', 'дневная'),
    ('Среда', 'дневная'),
    ('Четверг', 'дневная'),
    ('Пятница', 'дневная'),
    ('Выходной день', 'дневная');

  -- Вставляем позиции в таблицу
  INSERT INTO gps.positions (position_code, workshop_id, profession_id, grade_id, schedule_id, role_id)
  VALUES
    -- ЛПЦ-5
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
    
    -- ЛПЦ-11
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
    ('643857', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'), (SELECT id FROM gps.professions WHERE name = 'Резчик холодного металла'), (SELECT id FROM gps.grades WHERE grade_code = '3'), (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'), (SELECT id FROM gps.roles WHERE name = 'CUTTER'));

  -- Вставляем данные в таблицу shift_schedules (расписания смен)
  INSERT INTO gps.shift_schedules (start_time, end_time, workshop_id, schedule_id, shift_type_id)
  VALUES
    ('19:30', '07:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.shift_types WHERE name = 'Смена 1')),
    ('07:30', '19:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '2-А'),
      (SELECT id FROM gps.shift_types WHERE name = 'Смена 2')),
    ('07:30', '19:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.shift_types WHERE name = 'Бригада 1')),
    ('07:30', '19:30',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '9'),
      (SELECT id FROM gps.shift_types WHERE name = 'Бригада 2')),
    ('08:00', '17:00',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.schedules WHERE schedule_code = '5-Б-1'),
      (SELECT id FROM gps.shift_types WHERE name = 'Понедельник'));

  -- Вставляем данные в таблицу work_places (рабочие места)
  INSERT INTO gps.work_places (name, workshop_id, profession_id)
  VALUES
    ('ЛУМ',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Укладчик-упаковщик ЛУМ')),
    ('ЛУМ',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Оператор поста управления (старший)')),
    ('ЛУМ',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Оператор поста управления')),
    ('СТАН-2000 (1 очередь)',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Укладчик-упаковщик')),
    ('АНГЦ + АНО-ГЦ (2 очередь)',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Укладчик-упаковщик')),
    ('АНГЦ-3 (3 очередь)',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Укладчик-упаковщик')),
    ('Тупик 6',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Штабелировщик металла')),
    ('Тупик 7',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Штабелировщик металла')),
    ('Тупик 8',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Штабелировщик металла')),
    ('Тупик 10',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Штабелировщик металла')),
    ('Производство реквизитов',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции')),
    ('Производство реквизитов',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Водитель погрузчика')),
    ('Производство реквизитов',
      (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11'),
      (SELECT id FROM gps.professions WHERE name = 'Резчик холодного металла'))
EOSQL