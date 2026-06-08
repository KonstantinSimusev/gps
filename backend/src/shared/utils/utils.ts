export const toNumber = (value: unknown): number | null => {
  // 1. Обработка null/undefined — возвращаем null
  if (value == null) return null;

  // 2. Обработка строк
  if (typeof value === 'string') {
    const trimmed = value.trim();
    // Пустая строка после обрезки → null
    if (trimmed === '') return null;
    // Преобразование в число и проверка на NaN
    const num = Number(trimmed);
    return isNaN(num) ? null : num;
  }

  // 3. Обработка уже чисел
  if (typeof value === 'number') {
    // Проверяем, что число конечное (исключаем Infinity, -Infinity)
    return Number.isFinite(value) ? value : null;
  }

  // 4. Все остальные типы → null
  return null;
};

export const toString = (value: unknown): string | null => {
  // 1. Обработка null/undefined — возвращаем null
  if (value == null) return null;

  // 2. Обработка строк
  if (typeof value === 'string') {
    const trimmed = value.trim();
    // Пустая строка после обрезки → null
    if (trimmed === '') return null;
    return trimmed;
  }

  // 3. Все остальные типы → null
  return null;
};

export const toOptionalString = (value: unknown): string | null => {
  if (value == null) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed; // пустая строка → null
  }
  return null; // все остальные типы → null (не undefined!)
};

export const toBoolean = (value: unknown): boolean => {
  if (value == null) return false;

  if (typeof value === 'boolean') return value;

  if (typeof value === 'string') {
    const trimmed = value.trim().toLowerCase();
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
  }

  // Все остальные случаи (числа, объекты и т. д.) → false
  return false;
};
