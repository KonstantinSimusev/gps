export const ROLE_TO_PAGE: { [key: string]: string } = {
  ADMIN: '/admin',
  USER: '/home',
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

export const formatDate = (date: string | Date | null | undefined): string => {
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
  }); // Добавляем «г.» после года
};
