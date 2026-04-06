export const ROLE_TO_PAGE: { [key: string]: string } = {
  ADMIN: '/admin',
  HEAD: '/home',
  MASTER: '/master/timesheet',
  PACKER: '/packer/scan',
};

export const delay = (ms: number = 500): Promise<void> =>
  new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      resolve();
    }, ms);
  });

export const formatDateForUI = (date: string | Date | null | undefined): string => {
  // Обработка отсутствующих данных
  if (!date) return 'Некорректные данные';

  // Преобразуем вход в Date — работает и для строки, и для объекта Date
  const parsedDate = date instanceof Date ? date : new Date(date);

  // Проверка валидности даты
  if (isNaN(parsedDate.getTime())) {
    return 'Нет данных';
  }

  // Форматирование с нужным шаблоном
  return parsedDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const formatDateForInput = (
  date: string | Date | null | undefined,
): string => {
  // Обработка отсутствующих данных
  if (!date) return '';

  // Преобразуем вход в Date — работает и для строки, и для объекта Date
  const parsedDate = date instanceof Date ? date : new Date(date);

  // Проверка валидности даты
  if (isNaN(parsedDate.getTime())) {
    return '';
  }

  // Форматирование в формат YYYY-MM-DD для input[type="date"]
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
