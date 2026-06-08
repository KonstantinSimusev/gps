import { PROFILE_ROLE_OPTIONS } from './types';

export const delay = (ms: number = 500): Promise<void> =>
  new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      resolve();
    }, ms);
  });

export const formatDateForUI = (date: string | null): string => {
  if (date === null) {
    return '-';
  }

  // Преобразуем вход в Date — работает и для строки, и для объекта Date
  const parsedDate = new Date(date);

  // Проверка валидности даты
  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  // Получаем компоненты даты
  const day = parsedDate.getDate().toString().padStart(2, '0');
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0'); // getMonth() возвращает 0–11
  const year = parsedDate.getFullYear();

  // Форматируем в ДД.ММ.ГГГГ
  return `${day}.${month}.${year}`;
};

export const formatDateForISO = (date: string): string => {
  const [day, month, year] = date.split('.');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export const getRoleName = (roleValue: string): string => {
  const option = PROFILE_ROLE_OPTIONS.find((opt) => opt.value === roleValue);
  return option?.label || 'Не создана';
};
