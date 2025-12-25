import { EArea, ELocation, EProfession, ERailway, EUnit } from '../enums/enums';
import { ISchedule, IShift, IUser } from '../interfaces/api.interface';

export function getNextShift(teamNumber: number): ISchedule {
  const shifts = [
    {
      date: new Date('2025-10-15'),
      shiftNumber: 1,
      teamNumber: 4,
    },
    {
      date: new Date('2025-10-15'),
      shiftNumber: 2,
      teamNumber: 3,
    },
    {
      date: new Date('2025-10-16'),
      shiftNumber: 1,
      teamNumber: 2,
    },
    {
      date: new Date('2025-10-16'),
      shiftNumber: 2,
      teamNumber: 1,
    },
  ];

  // Находим смену
  const shift = shifts.find((shift) => shift.teamNumber === teamNumber);

  if (!shift) {
    throw new Error('Смена не найдена');
  }

  const startDate = new Date(shift.date);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 1);

  const startShiftNumber = shift.shiftNumber;

  // Создаем объект для результата
  let result: ISchedule = {
    date: new Date(startDate),
    shiftNumber: startShiftNumber,
    teamNumber: shift.teamNumber,
  };

  let currentDate = new Date(startDate);
  let currentShiftNumber = startShiftNumber;

  // Создаем массив смен
  while (currentDate <= endDate) {
    result.date = new Date(currentDate);
    result.shiftNumber = currentShiftNumber;
    result.teamNumber = shift.teamNumber;

    // Увеличиваем дату на 2 дня
    currentDate.setDate(currentDate.getDate() + 2);

    // Чередуем смены (1 <-> 2)
    currentShiftNumber = currentShiftNumber === 1 ? 2 : 1;
  }

  return result;
}

export function compareShifts(obj1: ISchedule, obj2: ISchedule): boolean {
  // Нормализация дат (убираем время)
  const normalizeDate = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  return (
    normalizeDate(obj1.date).toISOString() ===
      normalizeDate(obj2.date).toISOString() &&
    obj1.shiftNumber === obj2.shiftNumber &&
    obj1.teamNumber === obj2.teamNumber
  );
}

export const productions = [
  {
    location: ELocation.LINE_1,
    unit: EUnit.STAN,
    sortOrder: 1,
    count: 0,
  },
  {
    location: ELocation.LINE_2,
    unit: EUnit.ANGZ,
    sortOrder: 2,
    count: 0,
  },
  {
    location: ELocation.LINE_2,
    unit: EUnit.ANO,
    sortOrder: 3,
    count: 0,
  },
  {
    location: ELocation.LINE_2,
    unit: EUnit.AI,
    sortOrder: 4,
    count: 0,
  },
  {
    location: ELocation.LINE_3,
    unit: EUnit.ANGZ_3,
    sortOrder: 5,
    count: 0,
  },
];

export const shipments = [
  {
    location: ELocation.LINE_1,
    railway: ERailway.TUPIC_8,
    sortOrder: 1,
    count: 0,
  },
  {
    location: ELocation.LINE_2,
    railway: ERailway.TUPIC_6,
    sortOrder: 2,
    count: 0,
  },
  {
    location: ELocation.LINE_2,
    railway: ERailway.TUPIC_7,
    sortOrder: 3,
    count: 0,
  },
  {
    location: ELocation.LINE_3,
    railway: ERailway.TUPIC_10,
    sortOrder: 4,
    count: 0,
  },
];

export const packs = [
  {
    location: ELocation.LINE_1,
    area: EArea.PACK,
    sortOrder: 1,
    count: 0,
  },
  {
    location: ELocation.LINE_2,
    area: EArea.PACK,
    sortOrder: 2,
    count: 0,
  },
  {
    location: ELocation.LINE_2,
    area: EArea.LUM,
    sortOrder: 3,
    count: 0,
  },
  {
    location: ELocation.LINE_3,
    area: EArea.PACK,
    sortOrder: 4,
    count: 0,
  },
];

export const fixs = [
  {
    location: ELocation.LINE_1,
    railway: ERailway.TUPIC_8,
    sortOrder: 1,
    count: 0,
  },
  {
    location: ELocation.LINE_2,
    railway: ERailway.TUPIC_6,
    sortOrder: 2,
    count: 0,
  },
  {
    location: ELocation.LINE_2,
    railway: ERailway.TUPIC_7,
    sortOrder: 3,
    count: 0,
  },
  {
    location: ELocation.LINE_3,
    railway: ERailway.TUPIC_10,
    sortOrder: 4,
    count: 0,
  },
];

export const residues = [
  {
    location: ELocation.LINE_1,
    area: EArea.PACK,
    sortOrder: 1,
    count: 0,
  },
  {
    location: ELocation.LINE_2,
    area: EArea.PACK,
    sortOrder: 2,
    count: 0,
  },
  {
    location: ELocation.LINE_3,
    area: EArea.PACK,
    sortOrder: 3,
    count: 0,
  },
];

export const shifts = [
  {
    date: new Date('2025-10-15'),
    shiftNumber: 1,
    teamNumber: 4,
  },
  {
    date: new Date('2025-10-15'),
    shiftNumber: 2,
    teamNumber: 3,
  },
  {
    date: new Date('2025-10-16'),
    shiftNumber: 1,
    teamNumber: 2,
  },
  {
    date: new Date('2025-10-16'),
    shiftNumber: 2,
    teamNumber: 1,
  },
];

export function getProfessionCounts(
  users: IUser[],
): { profession: EProfession; count: number }[] {
  // Группируем пользователей по профессии и считаем количество
  const countsMap: Record<string, number> = users.reduce(
    (acc, user) => {
      if (user.profession) {
        // Проверяем, что profession существует и не undefined
        acc[user.profession] = (acc[user.profession] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  ); // Явно указываем тип начального значения

  // Преобразуем в массив объектов с profession (как EProfession) и count
  // Дополнительно извлекаем sortOrder для сортировки
  const resultWithSortOrder = Object.entries(countsMap).map(
    ([professionStr, count]) => {
      // Находим первого пользователя с этой профессией, чтобы взять sortOrder
      const user = users.find((u) => u.profession === professionStr);
      const grade = user?.grade ?? 0; // запасное значение, если sortOrder не задан

      return {
        profession: professionStr as EProfession,
        count,
        grade,
      };
    },
  );

  // Сортируем по sortOrder и убираем вспомогательное поле
  return resultWithSortOrder
    .sort((a, b) => b.grade - a.grade)
    .map(({ profession, count }) => ({ profession, count }));
}

export const isShowShift = (lastShift: IShift) => {
  if (!lastShift || !lastShift.date) return false;

  const today = new Date();
  const lastShiftDate = new Date(lastShift.date);

  // Устанавливаем время на 00:00:00 для корректного сравнения дат
  today.setHours(0, 0, 0, 0);
  lastShiftDate.setHours(0, 0, 0, 0);

  // Разница в днях между текущей датой и датой последней смены
  // today - lastShiftDate: положительное число = прошло дней, отрицательное = в будущем
  const diffTime = today.getTime() - lastShiftDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  /*
     Условия отображения:
     - если последняя смена сегодня (diffDays = 0) → показываем
     - если последняя смена была вчера (diffDays = 1) → показываем
     - если последняя смена будет завтра (diffDays = -1) → показываем (сегодня меньше на 1 день)
     - во всех остальных случаях (≥2 дня назад или ≥2 дня вперёд) → не показываем
    */
  return diffDays === 0 || diffDays === -1;
};
