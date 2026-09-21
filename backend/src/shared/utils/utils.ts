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

export const toDateString = (
  value: string | Date | null | undefined,
): string | null => {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) {
    return null;
  }

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
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

export const getUTC = (date: Date): Date => {
  const result = new Date(date);
  result.setUTCHours(0, 0, 0, 0); // Устанавливаем время на 00:00 UTC
  return result;
};

// Получаем и нормализуем текущую дату в фомате UTC
export const getUTCToday = (date: Date | null = null): Date => {
  const result = date ?? new Date();
  result.setUTCHours(0, 0, 0, 0);
  return result;
};

// Получаем и нормализуем завтра дату в фомате UTC
export const getUTCTomorrow = (date: Date | null = null): Date => {
  const result = date ?? new Date();
  result.setUTCHours(0, 0, 0, 0); // Устанавливаем время на 00:00 UTC
  result.setUTCDate(result.getUTCDate() + 1); // Сдвигаем на +1 день
  return result;
};

// Получаем и нормализуем завтра дату в фомате UTC
export const getUTCYesterday = (date: Date | null = null): Date => {
  const result = date ?? new Date();
  result.setUTCHours(0, 0, 0, 0); // Устанавливаем время на 00:00 UTC
  result.setUTCDate(result.getUTCDate() - 1); // Сдвигаем на -1 день
  return result;
};

// Получаем строку только с датой
export const getUTCDateString = (date: Date): string => {
  return date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
};

export const getShiftFor2A = (
  teamNumber: number,
  baseDate: Date | null = null,
): {
  dayOfWeek: number;
  date: Date;
  shiftCode: number | null; // null - выходной
  teamNumber: number;
} => {
  // Берём завтрашнюю дату в UTC
  const now = baseDate ?? new Date();
  const normalizedDate = new Date(now);
  const tomorrow = getUTCTomorrow(normalizedDate);

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
    dayOfWeek: 0, // график 2-А (универсальный, день - 0)
    date: resultDate,
    shiftCode: shiftNumber,
    teamNumber: teamSchedule.teamNumber,
  };
};

export const getShiftFor5B1 = (
  teamNumber: number,
  baseDate: Date | null = null,
): {
  dayOfWeek: number;
  date: Date;
  shiftCode: number | null; // null - выходной
  teamNumber: number;
} => {
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

  // Берём текущую дату
  const now = baseDate ?? new Date();

  // Нормализуем до полуночи UTC — это и будет «дата дня»
  const normalizedDate = new Date(now);
  normalizedDate.setUTCHours(0, 0, 0, 0);

  const utcYear = now.getUTCFullYear();
  const utcMonth = String(now.getUTCMonth() + 1).padStart(2, '0');
  const utcDay = String(now.getUTCDate()).padStart(2, '0');

  const dateKey = `${utcYear}-${utcMonth}-${utcDay}`;
  const utcDayOfWeek = now.getUTCDay(); // 0=вс, 1=пн, ..., 6=сб

  const isWeekendBase = utcDayOfWeek === 0 || utcDayOfWeek === 6;
  const isHoliday = HOLIDAYS_2026.has(dateKey);
  const isMovedWeekend = MOVED_WEEKENDS_2026.has(dateKey);

  // Выходной = базовый выходной ИЛИ перенесённый выходной ИЛИ праздник
  const isWorking = !(isWeekendBase || isMovedWeekend || isHoliday);
  const shiftCode = isWorking ? 2 : null;

  return {
    dayOfWeek: utcDayOfWeek,
    date: normalizedDate,
    shiftCode,
    teamNumber,
  };
};

export const getShiftFor9 = (
  teamNumber: number,
  baseDate: Date | null = null,
): {
  dayOfWeek: number;
  date: Date;
  shiftCode: number | null; // null - выходной
  teamNumber: number;
} => {
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
  const now = baseDate ?? new Date();
  const normalizedDate = new Date(now);
  normalizedDate.setUTCHours(0, 0, 0, 0);

  for (const schedule of schedules) {
    if (schedule.teamNumber !== teamNumber) {
      continue; // Фильтруем сразу по бригаде
    }

    const startDate = new Date(schedule.date);
    startDate.setUTCHours(0, 0, 0, 0);

    // Разница в днях от старта до целевой даты
    const diffMs = normalizedDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Если остаток от деления на 4 равен 0 — значит, сегодня как раз начало смены по этому циклу
    if (diffDays >= 0 && diffDays % 4 === 0) {
      return {
        dayOfWeek: 0, // график 9 (универсальный, день - 0)
        date: normalizedDate, // возвращаем нормализованную входную дату
        shiftCode: schedule.shiftNumber,
        teamNumber: schedule.teamNumber,
      };
    }
  }

  return {
    dayOfWeek: 0, // график 9 (универсальный, день - 0)
    date: normalizedDate,
    shiftCode: null, // выходной
    teamNumber,
  };
};

export const calcShiftDuration = (schedule: ShiftSchedule | null): number => {
  if (!schedule) {
    return 0;
  }

  const toMin = (t: string | null): number => {
    if (!t) return 0;
    // Безопасный парсинг времени ЧЧ:ММ
    const [hStr, mStr] = t.split(':');
    const h = Number(hStr ?? 0);
    const m = mStr ? Number(mStr) : 0;

    // Защита от некорректных данных
    if (isNaN(h) || isNaN(m)) return 0;

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

    lunchDuration = le - ls;

    // Обед тоже может пересекать полночь (редко, но бывает)
    if (lunchDuration < 0) {
      lunchDuration += 24 * 60;
    }
  }

  const totalMinutes = Math.max(0, end - start - lunchDuration);

  // ✅ Возвращаем сразу минуты (целое число), без округления до четверти часа
  return Math.round(totalMinutes);
};

export const formatDateToYYYYMMDD = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// export const getCurrentMonthDatesUntilToday = (): Date[] => {
//   const now = new Date();
//   const year = now.getUTCFullYear();
//   const month = now.getUTCMonth();
//   const todayDay = now.getUTCDate();

//   const dates: Date[] = [];

//   for (let day = 1; day <= todayDay; day++) {
//     const date = new Date(Date.UTC(year, month, day));
//     dates.push(date);
//   }

//   return dates;
// };

// export const getMissingDays = (monthDates: Date[], shifts: any[]): Date[] => {
//   // 1. Создаём Set из дат смен (нормализованных на 00:00)
//   const shiftDateKeys = new Set<number>(
//     shifts.map((shift) => {
//       const d = new Date(shift.date);
//       d.setUTCHours(0, 0, 0, 0);
//       return d.getTime();
//     }),
//   );

//   // 2. Фильтруем полный список месяца: оставляем только те даты, которых нет в сменах
//   return monthDates.filter((date) => {
//     const d = new Date(date);
//     d.setUTCHours(0, 0, 0, 0);
//     return !shiftDateKeys.has(d.getTime());
//   });
// };
