import { ShiftSchedule } from '../../modules/shift-schedule/entities/shift-schedule.entity';

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

// export function convert(duration: string): number {
//   const [hours, minutes] = duration.split(':').map(Number);
//   return hours + minutes / 60;
// }

// Получаем и нормализуем текущую дату в фомате UTC
export function getUTCToday() {
  const today = new Date();
  today.setUTCDate(today.getUTCDate());
  today.setUTCHours(0, 0, 0, 0); // Устанавливаем время на 00:00 UTC
  return today;
}

// Получаем и нормализуем завтра дату в фомате UTC
export function getUTCTomorrow() {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1); // Сдвигаем на +1 день
  tomorrow.setUTCHours(0, 0, 0, 0); // Устанавливаем время на 00:00 UTC
  return tomorrow;
}

export function getShiftFor2A(teamNumber: number): {
  date: Date;
  shiftCode: number;
  teamNumber: number;
} {
  // Берём завтрашнюю дату в UTC
  const tomorrow = getUTCTomorrow();

  // Расписание стартовых дат и смен для бригад в UTC
  const shiftSchedules = [
    {
      teamNumber: 1,
      date: new Date('2026-01-02T00:00:00.000Z'),
    },
    {
      teamNumber: 2,
      date: new Date('2026-01-04T00:00:00.000Z'),
    },
    {
      teamNumber: 3,
      date: new Date('2026-01-05T00:00:00.000Z'),
    },
    {
      teamNumber: 4,
      date: new Date('2026-01-07T00:00:00.000Z'),
    },
  ];

  // Находим запись для указанной бригады
  const teamSchedule = shiftSchedules.find(
    (item) => item.teamNumber === teamNumber,
  );

  const startDate = new Date(teamSchedule.date);
  startDate.setUTCHours(0, 0, 0, 0); // Нормализуем стартовую дату в UTC

  // Разница в миллисекундах между сегодняшней датой и стартовой датой бригады
  const diffMs = tomorrow.getTime() - startDate.getTime();

  // Разница в днях (округляем вниз)
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Количество полных 2‑дневных циклов с момента старта
  const fullCycles = Math.floor(diffDays / 2);

  // Определяем номер смены: чётный цикл — смена 1, нечётный — смена 2
  const shiftNumber = fullCycles % 2 === 0 ? 1 : 2;

  // Рассчитываем дату начала текущей смены в UTC
  const resultDate = new Date(startDate);
  resultDate.setUTCDate(startDate.getUTCDate() + fullCycles * 2);
  resultDate.setUTCHours(0, 0, 0, 0);

  return {
    date: resultDate,
    shiftCode: shiftNumber,
    teamNumber: teamSchedule.teamNumber,
  };
}

export function getShiftFor5B1(): {
  date: Date;
  dayOfWeek: number;
  weekdayName: string;
  isWorking: boolean;
  dayType: string;
} {
  // Только официальные нерабочие праздничные дни (ст. 112 ТК РФ)
  const HOLIDAYS_2026 = new Set([
    '2026-01-01',
    '2026-01-02',
    '2026-01-03',
    '2026-01-04',
    '2026-01-05',
    '2026-01-06',
    '2026-01-07',
    '2026-02-23',
    '2026-03-08',
    '2026-05-01',
    '2026-05-09',
    '2026-06-12',
    '2026-11-04',
  ]);

  // Перенесённые выходные дни (по Постановлению № 1466) — они становятся выходными,
  // даже если выпадают на будний день
  const MOVED_WEEKENDS_2026 = new Set([
    '2026-01-09', // перенос с 3 января (сб)
    '2026-12-31', // перенос с 4 января (вс)
  ]);

  const WEEKDAY_NAMES = [
    'воскресенье', // 0
    'понедельник', // 1
    'вторник', // 2
    'среда', // 3
    'четверг', // 4
    'пятница', // 5
    'суббота', // 6
  ];

  // Берём текущую дату
  const now = new Date();

  // Нормализуем до полуночи UTC — это и будет «дата дня»
  const normalizedDate = new Date(now);
  normalizedDate.setUTCHours(0, 0, 0, 0);

  const utcYear = now.getUTCFullYear();
  const utcMonth = String(now.getUTCMonth() + 1).padStart(2, '0');
  const utcDay = String(now.getUTCDate()).padStart(2, '0');

  const dateKey = `${utcYear}-${utcMonth}-${utcDay}`;
  const utcDayOfWeek = now.getUTCDay(); // 0=вс, 1=пн, ..., 6=сб

  // Формат 1–7 (1=понедельник, 7=воскресенье)
  const dayOfWeekNumber = utcDayOfWeek === 0 ? 7 : utcDayOfWeek;
  const weekdayName = WEEKDAY_NAMES[utcDayOfWeek];

  const isWeekendBase = utcDayOfWeek === 0 || utcDayOfWeek === 6;
  const isHoliday = HOLIDAYS_2026.has(dateKey);
  const isMovedWeekend = MOVED_WEEKENDS_2026.has(dateKey);

  // Выходной = базовый выходной ИЛИ перенесённый выходной ИЛИ праздник
  const isWorking = !(isWeekendBase || isMovedWeekend || isHoliday);
  const dayType = isWorking ? 'рабочий' : 'выходной';

  return {
    date: normalizedDate,
    dayOfWeek: dayOfWeekNumber,
    weekdayName,
    isWorking,
    dayType,
  };
}

export function getShiftFor9(teamNumber: 1 | 2): {
  date: Date;
  teamNumber: number;
  shiftCode: number | null;
} {
  const schedules = [
    {
      teamNumber: 1,
      shiftNumber: 1,
      date: new Date('2026-01-02T00:00:00.000Z'),
    },
    {
      teamNumber: 1,
      shiftNumber: 2,
      date: new Date('2026-01-03T00:00:00.000Z'),
    },
    {
      teamNumber: 2,
      shiftNumber: 1,
      date: new Date('2026-01-04T00:00:00.000Z'),
    },
    {
      teamNumber: 2,
      shiftNumber: 2,
      date: new Date('2026-01-05T00:00:00.000Z'),
    },
  ];

  // Нормализуем входную дату до 00:00 UTC
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);

  for (const schedule of schedules) {
    if (schedule.teamNumber !== teamNumber) {
      continue; // Фильтруем сразу по бригаде
    }

    const startDate = new Date(schedule.date);
    startDate.setUTCHours(0, 0, 0, 0);

    // Разница в днях от старта до целевой даты
    const diffMs = now.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Если остаток от деления на 4 равен 0 — значит, сегодня как раз начало смены по этому циклу
    if (diffDays >= 0 && diffDays % 4 === 0) {
      return {
        date: now, // возвращаем нормализованную входную дату
        teamNumber: schedule.teamNumber,
        shiftCode: schedule.shiftNumber,
      };
    }
  }

  return {
    date: now,
    teamNumber,
    shiftCode: null, // Выходной
  };
}

export function calcShiftDuration(schedule: ShiftSchedule | null): number {
  if (!schedule) {
    return 0;
  }

  const toMin = (t: string | null): number => {
    if (!t) return 0;
    const [hStr, mStr] = t.split(':');
    const h = Number(hStr);
    const m = mStr ? Number(mStr) : 0;
    return h * 60 + m;
  };

  const start = toMin(schedule.startTime);
  let end = toMin(schedule.endTime);

  // Если конец раньше начала — смена пересекает полночь
  if (end < start) {
    end += 24 * 60; // +1440 минут
  }

  let lunchDuration = 0;
  if (schedule.lunchStart && schedule.lunchEnd) {
    const ls = toMin(schedule.lunchStart);
    const le = toMin(schedule.lunchEnd);

    // Обед тоже может пересекать полночь
    lunchDuration = le - ls;
    if (lunchDuration < 0) {
      lunchDuration += 24 * 60;
    }
  }

  const totalMinutes = end - start - lunchDuration;
  return Math.max(0, totalMinutes / 60);
}
