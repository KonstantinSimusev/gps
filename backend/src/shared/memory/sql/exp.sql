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


SELECT
    p.name AS профессия,
    COUNT(CASE WHEN t.team_number = '1' THEN e.id END) AS бр1,
    COUNT(CASE WHEN t.team_number = '2' THEN e.id END) AS бр2,
    COUNT(CASE WHEN t.team_number = '3' THEN e.id END) AS бр3,
    COUNT(CASE WHEN t.team_number = '4' THEN e.id END) AS бр4,
    COUNT(e.id) AS итого
FROM gps.employees e
JOIN gps.teams t ON e.team_id = t.id
JOIN gps.positions pos ON e.position_id = pos.id
JOIN gps.professions p ON pos.profession_id = p.id
WHERE t.team_number <> '5'
  AND t.team_number IN ('1', '2', '3', '4')
GROUP BY p.name
ORDER BY p.name;