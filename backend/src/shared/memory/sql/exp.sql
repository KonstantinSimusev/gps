INSERT INTO gps.positions (position_code, workshop_id)
SELECT
  pos_code,
  (SELECT id FROM gps.workshops WHERE workshop_code = ws_code)
FROM (
  VALUES
    ('10000001', 'ЛПЦ-4'),
    ('10000002', 'ЛПЦ-5'),
    ('10000003', 'ЛПЦ-7'),
    ('10000004', 'ЛПЦ-8'),
    ('10000005', 'ЛПЦ-10'),
    ('10000006', 'ЛПЦ-11'),
    ('10000011', 'ЛПЦ-11'),
    ('10000007', 'ПМП (ЮБ)'),
    ('10000008', 'ПМП (СБ)'),
    ('10000009', 'УВС'),
    ('10000010', 'Управление')
) pos_code, ws_code;

INSERT INTO gps.positions (position_code, workshop_id)
VALUES
    ('10000001', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-4')),
    ('10000002', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-5')),
    ('10000003', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-7')),
    ('10000004', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-8')),
    ('10000005', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-10')),
    ('10000006', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11')),
    ('10000011', (SELECT id FROM gps.workshops WHERE workshop_code = 'ЛПЦ-11')),
    ('10000007', (SELECT id FROM gps.workshops WHERE workshop_code = 'ПМП (ЮБ)')),
    ('10000008', (SELECT id FROM gps.workshops WHERE workshop_code = 'ПМП (СБ)')),
    ('10000009', (SELECT id FROM gps.workshops WHERE workshop_code = 'УВС')),
    ('10000010', (SELECT id FROM gps.workshops WHERE workshop_code = 'Управление'))
ON CONFLICT (position_code) DO NOTHING;

DROP TABLE gps.employees; 
DROP TABLE gps.positions;
DROP TABLE gps.workshops;
DROP TABLE gps.professions;
DROP TABLE gps.grades;
DROP TABLE gps.schedules;
DROP TABLE gps.roles;
DROP TABLE gps.teams;

DROP TYPE IF EXISTS gps.workshop_type;
DROP TYPE IF EXISTS gps.position_type;

SELECT * FROM gps.employees;
SELECT * FROM gps.positions;
SELECT * FROM gps.workshops;

DELETE FROM gps.employees;
DELETE FROM gps.positions;
DELETE FROM gps.workshops;

SELECT COUNT(employees.id) employee_count
FROM gps.employees
JOIN gps.positions ON employees.position_id = positions.id
JOIN gps.workshops ON positions.workshop_id = workshops.id
WHERE workshops.workshop_code = 'ЛПЦ-11';
