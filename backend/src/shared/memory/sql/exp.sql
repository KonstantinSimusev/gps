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
    CASE
        WHEN p.name = 'Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции'
        THEN 'Бригадир на отделке'
        ELSE p.name
    END AS профессия,
    g.grade_code AS разряд,
    COUNT(CASE WHEN t.team_number = '1' THEN e.id END) AS бр1,
    COUNT(CASE WHEN t.team_number = '2' THEN e.id END) AS бр2,
    COUNT(CASE WHEN t.team_number = '3' THEN e.id END) AS бр3,
    COUNT(CASE WHEN t.team_number = '4' THEN e.id END) AS бр4,
    COUNT(e.id) AS итого
FROM gps.employees e
JOIN gps.teams t ON e.team_id = t.id
JOIN gps.positions pos ON e.position_id = pos.id
JOIN gps.professions p ON pos.profession_id = p.id
JOIN gps.grades g ON pos.grade_id = g.id
WHERE t.team_number <> '5'
  AND t.team_number IN ('1', '2', '3', '4')
GROUP BY
    CASE
        WHEN p.name = 'Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции'
        THEN 'Бригадир на отделке'
        ELSE p.name
    END,
    g.grade_code
ORDER BY
    CAST(g.grade_code AS INTEGER) DESC,
    CASE
        WHEN p.name = 'Бригадир на отделке, сортировке, приёмке, сдаче, пакетировке и упаковке металла и готовой продукции'
        THEN 'Бригадир на отделке'
        ELSE p.name
    END ASC;



-- Вставляем роль в таблицу
INSERT INTO gps.employee_roles (role_id, employee_id)
VALUES 
    (
    'e13d87cc-717a-4f1a-affb-441f6cbbb102', -- role_id роли PACKER
    '3afeac57-a89a-4315-8d22-48faa4234140' -- employee_id Константина Симусева
    );

INSERT INTO gps.employee_roles (role_id, employee_id)
VALUES 
    (
        (SELECT id FROM gps.roles WHERE name = 'ADMIN'), -- получаем role_id через подзапрос
        (SELECT id FROM gps.employees WHERE first_name = 'Константин' AND last_name = 'Симусев') -- получаем employee_id через подзапрос
    );

UPDATE gps.employee_roles
SET role_id = (SELECT id FROM gps.roles WHERE name = 'SECTION_MASTER')
WHERE role_id = (SELECT id FROM gps.roles WHERE name = 'ADMIN')
  AND employee_id = (
    SELECT id
    FROM gps.employees
    WHERE first_name = 'Константин' AND last_name = 'Симусев'
  );

DELETE FROM gps.employee_roles
WHERE role_id = (SELECT id FROM gps.roles WHERE name = 'SECTION_MASTER')
  AND employee_id = (
    SELECT id
    FROM gps.employees
    WHERE first_name = 'Константин' AND last_name = 'Симусев'
  );