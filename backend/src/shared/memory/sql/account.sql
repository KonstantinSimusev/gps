-- Найти аккаунт по личному номеру
SELECT *
FROM gps.accounts
WHERE id IN (
  SELECT account_id
  FROM gps.employees
  WHERE personal_number = '777'
);

-- Найти логин по личному номеру
SELECT login
FROM gps.accounts
WHERE id IN (
  SELECT account_id
  FROM gps.employees
  WHERE personal_number = '777'
);