import { PROFILE_ROLE_OPTIONS } from './types';

export const delay = (ms: number = 500): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

export const toDateString = (value: string): string => {
  const [day, month, year] = value.split('.');
  return `${year}-${month}-${day}`;
};

export const formatNotificationDate = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();

  // Обнуляем время для сравнения дат
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((today.getTime() - dateDay.getTime()) / 86400000);

  // Сегодня — показываем время
  if (diffDays === 0) {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Вчера
  if (diffDays === 1) {
    return 'вчера';
  }

  // От 2 до 7 дней назад — день недели (короткий формат: «пн», «ср»)
  if (diffDays >= 2 && diffDays <= 7) {
    return date.toLocaleDateString('ru-RU', { weekday: 'long' });
  }

  // Старше недели — полная дата: «23 авг»
  // return date.toLocaleDateString('ru-RU', {
  //   day: '2-digit',
  //   month: 'short',
  // });

  // Старше недели — формат ДД.ММ.ГГГГ (например, 23.08.2026)
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export const formatDateForDayUI = (date: Date | string | null): string => {
  if (date === null) {
    return '-';
  }

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toString() === 'Invalid Date'
  ) {
    return '';
  }

  const monthNames = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  const day = parsedDate.getDate();
  const monthIndex = parsedDate.getMonth();

  return `${day} ${monthNames[monthIndex]}`;
};

export const formatDateForUI = (date: Date | string | null): string => {
  if (date === null) {
    return '-';
  }

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toString() === 'Invalid Date'
  ) {
    return '';
  }

  const monthNames = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  const day = parsedDate.getDate();
  const monthIndex = parsedDate.getMonth();
  const year = parsedDate.getFullYear();

  return `${day} ${monthNames[monthIndex]} ${year} г.`;
};

export const formatDateFormUI = (date: string | null): string => {
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

export const getDayName = (dayOfWeek: number): string => {
  const WEEKDAY_NAMES = [
    'Воскресенье', // 0
    'Понедельник', // 1
    'Вторник', // 2
    'Среда', // 3
    'Четверг', // 4
    'Пятница', // 5
    'Суббота', // 6
  ];

  const utcDayOfWeek = dayOfWeek; // 0=вс, 1=пн, ..., 6=сб
  const weekdayName = WEEKDAY_NAMES[utcDayOfWeek];

  return weekdayName;
};

export interface HoursMinutes {
  hours: number;
  minutes: number;
}

export const parseMinutesToHoursMinutes = (
  raw: number | undefined | null,
): HoursMinutes => {
  if (raw === undefined || raw === null) {
    return { hours: 0, minutes: 0 };
  }

  const totalMinutes = Number(raw);

  if (!Number.isFinite(totalMinutes) || totalMinutes < 0) {
    return { hours: 0, minutes: 0 };
  }

  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  return { hours: h, minutes: m };
};

export const formatDurationForUI = (raw: number | undefined | null): string => {
  if (raw === undefined || raw === null) return '-';

  const { hours, minutes } = parseMinutesToHoursMinutes(raw);

  // Форматируем минуты всегда как 2 цифры (00, 05, 15...)
  const minStr = String(minutes).padStart(2, '0');

  // Часы оставляем без ведущего нуля (8 ч, а не 08 ч), чтобы не путать со временем суток
  return `${hours} ч ${minStr} мин`;
};
