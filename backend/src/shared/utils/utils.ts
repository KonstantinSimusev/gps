export const toNumber = (value: unknown): number | undefined => {
  // 1. Обработка null/undefined
  if (value == null) return undefined;

  // 2. Обработка строк
  if (typeof value === 'string') {
    const trimmed = value.trim();
    // Пустая строка после обрезки → ошибка
    if (trimmed === '') return undefined;
    // Преобразование в число и проверка на NaN
    const num = Number(trimmed);
    return isNaN(num) ? undefined : num;
  }

  // 3. Обработка уже чисел
  if (typeof value === 'number') {
    // Проверяем, что число конечное (исключаем Infinity, -Infinity)
    return Number.isFinite(value) ? value : undefined;
  }

  // 4. Все остальные типы → ошибка валидации
  return undefined;
};

export const toString = (value: unknown): string | undefined => {
  // 1. Обработка null/undefined
  if (value == null) return undefined;

  // 2. Обработка строк
  if (typeof value === 'string') {
    const trimmed = value.trim();
    // Пустая строка после обрезки → ошибка
    if (trimmed === '') return undefined;
    return trimmed;
  }

  // 3. Все остальные типы → ошибка валидации
  return undefined;
};

export const toOptionalString = (value: unknown): string | null => {
  if (value == null) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed; // пустая строка → null
  }
  return null; // все остальные типы → null (не undefined!)
};
