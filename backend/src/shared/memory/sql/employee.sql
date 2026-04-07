-- Удаляем связанные роли
DELETE FROM gps.employee_roles
WHERE employee_id IN (
  SELECT id FROM gps.employees
  WHERE personal_number = '1357371'
);

-- Удаление сотрудника по личному номеру
DELETE FROM gps.employees
WHERE personal_number = '1357371';