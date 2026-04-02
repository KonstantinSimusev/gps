DROP TYPE IF EXISTS gps.workshop_type;
DROP TYPE IF EXISTS gps.position_type;

SELECT * FROM gps.employees;
SELECT * FROM gps.positions;
SELECT * FROM gps.workshops;

DELETE FROM gps.employees;
DELETE FROM gps.positions;
DELETE FROM gps.workshops;

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
    ('FOREMAN_UOP'), -- Бригадир на участках основного производства
    ('FOREMAN_OGP'), -- Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции
    ('PACKER'), -- Укладчик‑упаковщик
    ('PACKER_LUM'), -- Укладчик‑упаковщик ЛУМ
    ('REPAIR_MECHANIC'), -- Слесарь‑ремонтник
    ('METAL_STACKER'), -- Штабелировщик металла
    ('STAMPER'), -- Штамповщик
    ('FORKLIFT_DRIVER'), -- Водитель погрузчика
    ('COLD_CUTTER'), -- Резчик холодного металла
    ('SENIOR_MASTER'), -- Старший мастер участка
    ('FLAME_CUTTER'), -- Газорезчик
    ('CRANE_OPERATOR'), -- Машинист крана
    ('AUTOMATION_ENGINEER'), -- Ведущий инженер по автоматизации и механизации производственных процессов
    ('SENIOR_CONTROL_OPERATOR'), -- Оператор поста управления (старший)
    ('CONTROL_OPERATOR'), -- Оператор поста управления
    ('ELECTRICAL_TECHNICIAN'), -- Электромонтёр по ремонту и обслуживанию электрооборудования
    ('MOVEMENT_LEADER'), -- Бригадир по перемещению сырья, полуфабрикатов и готовой продукции в процессе производства
    ('CRANEMAN'), -- Машинист крана (крановщик)
    ('SENIOR_STOREKEEPER'), -- Кладовщик (старший)
    ('CAR_DRIVER'), -- Водитель автомобиля
    ('STOREKEEPER'); -- Кладовщик

-- Обновить роль сотрудника при старте приложения на ADMIN
UPDATE gps.employee_roles
SET role_id = (SELECT id FROM gps.roles WHERE name = 'ADMIN')
WHERE employee_id = (
  SELECT id FROM gps.employees WHERE personal_number = '135910'
);

-- Удалить роль сотрудника по личному номеру
DELETE FROM gps.employee_roles
WHERE employee_id = (
  SELECT id FROM gps.employees WHERE personal_number = '135829'
);

-- Вставляем роль в таблицу
INSERT INTO gps.employee_roles (employee_id, role_id)
VALUES (
  (SELECT id FROM gps.employees WHERE first_name = 'Константин' AND last_name = 'Симусев'),
  (SELECT id FROM gps.roles WHERE name = 'PACKER')
);

INSERT INTO gps.employee_roles (employee_id, role_id)
VALUES (
  (SELECT id FROM gps.employees WHERE personal_number = '135910'),
  (SELECT id FROM gps.roles WHERE name = 'ADMIN')
);

INSERT INTO gps.employee_roles (employee_id, role_id)
SELECT employees.id, (SELECT id FROM gps.roles WHERE name = 'PACKER')
FROM gps.employees
JOIN gps.positions ON employees.position_id = positions.id
WHERE positions.position_code = '643844';

-- Отчистить таблицу
TRUNCATE TABLE gps.employee_roles;

-- Выбрать роль по личному номеру
SELECT
  roles.name
FROM gps.employees
JOIN gps.employee_roles ON employees.id = employee_roles.employee_id
JOIN gps.roles ON employee_roles.role_id = roles.id
WHERE employees.personal_number = '135829';

-- Выбрать роль по штатной позиции
SELECT name
FROM gps.roles
JOIN gps.positions ON roles.id = positions.role_id
WHERE positions.position_code = '643777';