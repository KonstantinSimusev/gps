import { INotice } from '../interfaces/api.interface';
import { ESchedule, EWorkshop } from '../enums/enums';
import { Notice } from '../../modules/notice/entities/notice.entity';

export const toNumber = (value: unknown): number => {
  // 1. Ловим отсутствие данных сразу
  if (value == null) return 0;

  // 2. Работаем со строками
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return 0; // Пустая строка = 0

    const num = Number(trimmed);
    // isFinite ловит NaN, Infinity. Если не число → 0
    return Number.isFinite(num) ? num : 0;
  }

  // 3. Работаем с числами
  if (typeof value === 'number') {
    // Если число бесконечное или NaN → 0
    return Number.isFinite(value) ? value : 0;
  }

  // 4. Всё остальное (boolean, object) → 0
  return 0;
};

export const toOptionalNumber = (value: unknown): number | null => {
  // 1. null/undefined сразу → null
  if (value == null) return null;

  // 2. Строки: убираем пробелы, проверяем на пустоту, пытаемся превратить в число
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return null; // пустая строка → нет значения
    const num = Number(trimmed); // пытаемся сделать число
    return Number.isNaN(num) ? null : num; // если не получилось (NaN) → null
  }

  // 3. Числа: оставляем только конечные числа
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null; // Infinity, -Infinity, NaN → null
  }

  // 4. Всё остальное (булевы, объекты и т.д.) → null
  return null;
};

export const toString = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
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

export const toOptionalBoolean = (value: unknown): boolean | null => {
  if (value == null) return null; // <-- важно: null остаётся null

  if (typeof value === 'boolean') return value;

  if (typeof value === 'string') {
    const trimmed = value.trim().toLowerCase();
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
  }

  return null; // или false — зависит от того, как трактуешь «мусор»
};

export const getShiftFor2A = (
  teamNumber: number,
): {
  dayOfWeek: number;
  date: Date;
  shiftCode: number | null; // null - выходной
  teamNumber: number;
} => {
  // Сегодня в UTC 00:00
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Завтра = сегодня + 1 день
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

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

  // Сегодня в UTC 00:00
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);

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
    date: now,
    shiftCode,
    teamNumber,
  };
};

export const getShiftFor9 = (
  teamNumber: number,
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

  // Сегодня в UTC 00:00
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
        dayOfWeek: 0, // график 9 (универсальный, день - 0)
        date: now, // возвращаем нормализованную входную дату
        shiftCode: schedule.shiftNumber,
        teamNumber: schedule.teamNumber,
      };
    }
  }

  return {
    dayOfWeek: 0, // график 9 (универсальный, день - 0)
    date: now,
    shiftCode: null, // выходной
    teamNumber,
  };
};

export const isCondition_2A = (
  workshopCode: string,
  scheduleCode: string,
): boolean => {
  return (
    scheduleCode === ESchedule.S_2A &&
    [
      EWorkshop.W_LPC4,
      EWorkshop.W_LPC5,
      EWorkshop.W_LPC8_UGP,
      EWorkshop.W_LPC8_UL,
      EWorkshop.W_LPC10,
      EWorkshop.W_LPC11,
      EWorkshop.W_PMP_NORTH,
      EWorkshop.W_PMP_SOUTH,
    ].includes(workshopCode as EWorkshop)
  );
};

export const isCondition_5B1 = (
  workshopCode: string,
  scheduleCode: string,
): boolean => {
  return (
    scheduleCode === ESchedule.S_5B1 &&
    [
      EWorkshop.W_LPC4,
      EWorkshop.W_LPC5,
      EWorkshop.W_LPC8_UGP,
      EWorkshop.W_LPC8_UL,
      EWorkshop.W_LPC10,
      EWorkshop.W_LPC11,
      EWorkshop.W_PMP_NORTH,
      EWorkshop.W_PMP_SOUTH,
    ].includes(workshopCode as EWorkshop)
  );
};

export const isCondition_5B1_9 = (
  workshopCode: string,
  scheduleCode: string,
): boolean => {
  return (
    scheduleCode === ESchedule.S_5B1 &&
    [
      // EWorkshop.W_LPC5,
      // EWorkshop.W_LPC8_UGP,
      EWorkshop.W_LPC8_UL,
      EWorkshop.W_LPC10,
      EWorkshop.W_PMP_NORTH,
    ].includes(workshopCode as EWorkshop)
  );
};

export const isCondition_2A_9 = (
  workshopCode: string,
  scheduleCode: string,
): boolean => {
  return (
    scheduleCode === ESchedule.S_2A &&
    [EWorkshop.W_LPC8_UGP].includes(workshopCode as EWorkshop)
  );
};

export const isCondition_2A_2 = (
  workshopCode: string,
  scheduleCode: string,
): boolean => {
  return (
    (scheduleCode === ESchedule.S_2A || scheduleCode === ESchedule.S_2) &&
    [EWorkshop.W_LPC11].includes(workshopCode as EWorkshop)
  );
};

export const getScheduleConfigsToNitice = (
  workshopCode: string,
  teamNumber: number,
  scheduleCode: string,
): { scheduleCode: string; teamNumber: number }[] => {
  const result: { scheduleCode: string; teamNumber: number }[] = [];

  // 2-А основная смена
  if (isCondition_2A(workshopCode, scheduleCode)) {
    result.push({ scheduleCode: ESchedule.S_2A, teamNumber });
  }

  // 5-Б-1 основная смена
  if (isCondition_5B1(workshopCode, scheduleCode)) {
    result.push({ scheduleCode: ESchedule.S_5B1, teamNumber });
  }

  // 9 в 5-Б-1: бригады 1 и 2
  if (isCondition_5B1_9(workshopCode, scheduleCode)) {
    result.push({ scheduleCode: ESchedule.S_9, teamNumber: 1 });
    result.push({ scheduleCode: ESchedule.S_9, teamNumber: 2 });
  }

  // 9 в 2-А: бригады 1 и 2
  if (isCondition_2A_9(workshopCode, scheduleCode)) {
    result.push({ scheduleCode: ESchedule.S_9, teamNumber: 1 });
    result.push({ scheduleCode: ESchedule.S_9, teamNumber: 2 });
  }

  return result;
};

export const isRelevantShift = (currentShift: {
  date: Date;
  shiftCode: number;
}): boolean => {
  // Вспомогательная функция: гарантированно возвращает дату в формате YYYY-MM-DD в UTC
  const getDateStr = (d: Date) => {
    return d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
  };

  // Сегодня в UTC 00:00
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Завтра = сегодня + 1 день
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  const isFirstShiftTomorrow =
    currentShift.shiftCode === 1 &&
    getDateStr(currentShift.date) === getDateStr(tomorrow);

  const isFirstShiftToday =
    currentShift.shiftCode === 1 &&
    getDateStr(currentShift.date) === getDateStr(today);

  const isSecondShiftToday =
    currentShift.shiftCode === 2 &&
    getDateStr(currentShift.date) === getDateStr(today);

  return isFirstShiftTomorrow || isFirstShiftToday || isSecondShiftToday;
};

export const normalizeScheduleCode = (
  workshopCode: string,
  scheduleCode: string,
): string => {
  return workshopCode === EWorkshop.W_LPC11 && scheduleCode === ESchedule.S_2
    ? ESchedule.S_2A
    : scheduleCode;
};

export const mapNotice = (notice: Notice): INotice => {
  // sourceDate — это просто день события. Нам нужна только дата.
  const formattedSourceDate = notice.sourceDate
    ? new Date(notice.sourceDate).toISOString().split('T')[0] // "2026-09-25"
    : null;

  return {
    id: notice.id,
    sourceId: notice.sourceId,
    sourceDate: formattedSourceDate, // Только дата
    categoryCode: notice.title?.category?.categoryCode ?? '',
    titleText: notice.title?.titleText ?? '',
    statusLabel: notice.title?.status?.statusLabel ?? '',
    actionCode: notice.title?.action?.actionCode ?? '',
    actionLabel: notice.title?.action?.actionLabel ?? '',
    isUnread: notice.isUnread,
    isResolved: notice.isResolved,
    createdAt: notice.createdAt.toISOString(),
    workshopCode: notice.workshop?.workshopCode ?? '',
    teamNumber: notice.team?.teamNumber ?? 0,
    scheduleCode: notice.schedule?.scheduleCode ?? '',
  };
};
