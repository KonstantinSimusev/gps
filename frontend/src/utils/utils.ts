import { useState, useEffect } from 'react';
import { IPack, IResidue, IShift, IUserShift } from './api.interface';
import {
  TProfession,
  TRole,
  TWorkStatus,
  WORK_STATUS_ABBREVIATIONS,
  WORK_STATUS_OPTIONS,
} from './types';

export const formatDate = (date: Date) => {
  const parsedDate = new Date(date);
  return parsedDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const delay = (ms: number = 1000): Promise<void> =>
  new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      resolve();
    }, ms);
  });

export function getCount(array: any[]): number {
  return array.reduce((total, item) => total + item.count, 0);
}

export function formatProductionUnit(unit: string | undefined | null): string {
  if (!unit) return '';

  switch (unit) {
    case 'СТАН':
      return 'СТАН-2000';
    case 'АИ':
      return 'Агрегат Испекции';
    case 'АНО':
      return 'АНО-ГЦ';
    default:
      return unit;
  }
}

export function countProfessions(usersShifts: IUserShift[]) {
  const count: Record<string, number> = {};
  const sortOrderMap: Record<string, number> = {};

  // Проходим по каждому сотруднику
  usersShifts.forEach((userShift) => {
    // Безопасное получение профессии: если undefined → используем заглушку
    const profession = userShift.user?.profession ?? 'Unknown';
    const user = userShift.user;

    // Учитываем количество профессий
    if (count[profession]) {
      count[profession]++;
    } else {
      count[profession] = 1;
    }

    // Сохраняем sortOrder для профессии (если пользователь и sortOrder доступны)
    if (user && user.sortOrder != null) {
      sortOrderMap[profession] = user.sortOrder;
    }
  });

  // Преобразуем объект в массив объектов { profession, count, sortOrder }
  const result = Object.keys(count).map((profession) => ({
    profession: profession,
    count: count[profession],
    sortOrder: sortOrderMap[profession] || 0, // если sortOrder не найден, ставим 0
  }));

  // Сортируем по sortOrder
  return result.sort((a, b) => a.sortOrder - b.sortOrder);
}

export function countProfessionsByAttendance(
  usersShifts: IUserShift[],
): { profession: string; count: number; sortOrder: number }[] {
  const count: Record<string, number> = {};

  // Фиксированная карта приоритетов профессий (главный критерий сортировки)
  const priorityMap: Record<string, number> = {
    'Укладчик-упаковщик': 1,
    'Штабелировщик металла': 2,
    'Оператор ПУ': 3,
    'Укладчик-упаковщик ЛУМ': 4,
    'Бригадир ОСП': 5,
    'Водитель погрузчика': 6,
    'Резчик холодного металла': 7,
    // Все остальные профессии получат приоритет 99 (будут в конце)
  };

  // Проходим по каждому элементу смены
  usersShifts.forEach((userShift) => {
    // Учитываем только записи со статусом "Явка"
    if (
      userShift.workStatus !== 'Явка' ||
      userShift.workPlace === 'Не выбрано'
    ) {
      return;
    }

    const profession = userShift.shiftProfession;

    // Увеличиваем счётчик для данной профессии
    if (count[profession]) {
      count[profession]++;
    } else {
      count[profession] = 1;
    }
  });

  // Преобразуем собранные данные в массив объектов
  const result = Object.keys(count).map((profession) => ({
    profession,
    count: count[profession],
    // Основной критерий сортировки — приоритет из priorityMap
    // Если профессии нет в карте, ставим высокий номер (в конец списка)
    sortOrder: priorityMap[profession] || 99,
  }));

  // Сортируем результат по приоритету (sortOrder)
  return result.sort((a, b) => a.sortOrder - b.sortOrder);
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

export function countProfessionsByAddedAttendance(
  usersShifts: IUserShift[],
  teamNumber: number,
): {
  profession: string;
  teamNumber: number;
  count: number;
  sortOrder: number;
}[] {
  // Расширяем тип вложенного объекта: добавляем statusIndex
  const resultMap: Record<
    string,
    Record<number, { count: number; sortOrder: number; statusIndex: number }>
  > = {};

  usersShifts.forEach((userShift) => {
    // Учитываем только записи со статусом "Явка",
    // местом работы не "Не выбрано"
    // и номером команды, не равным teamNumber
    if (
      userShift.workStatus !== 'Явка' ||
      userShift.workPlace === 'Не выбрано' ||
      userShift.user?.teamNumber === teamNumber
    ) {
      return;
    }

    const profession = userShift.shiftProfession;

    if (!resultMap[profession]) {
      resultMap[profession] = {};
    }

    const currentTeamNumber = userShift.user?.teamNumber ?? 0;

    if (!resultMap[profession][currentTeamNumber]) {
      resultMap[profession][currentTeamNumber] = {
        count: 0,
        sortOrder: userShift.user?.sortOrder ?? 0,
        statusIndex: 0, // инициализируем как 0, т.к. больше не используем statusAbbreviations
      };
    }

    resultMap[profession][currentTeamNumber].count++;
  });

  const result = Object.keys(resultMap).reduce(
    (acc, profession) => {
      const teamNumbers = Object.keys(resultMap[profession]).map(Number);
      teamNumbers.forEach((teamNum) => {
        acc.push({
          profession,
          teamNumber: teamNum,
          count: resultMap[profession][teamNum].count,
          sortOrder: resultMap[profession][teamNum].sortOrder,
          statusIndex: resultMap[profession][teamNum].statusIndex,
        });
      });
      return acc;
    },
    [] as {
      profession: string;
      teamNumber: number;
      count: number;
      sortOrder: number;
      statusIndex: number;
    }[],
  );

  return (
    result
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        return a.statusIndex - b.statusIndex;
      })
      // Удаляем statusIndex из итогового объекта (если не нужен снаружи)
      .map(({ profession, teamNumber, count, sortOrder }) => ({
        profession,
        teamNumber,
        count,
        sortOrder,
      }))
  );
}

export const transformWorkStatusOptions = (): string[] => {
  return WORK_STATUS_OPTIONS.map((status: TWorkStatus) => {
    // Берем сокращение из словаря; если нет — дефолтная логика
    return (
      WORK_STATUS_ABBREVIATIONS[status] ?? status.slice(0, 2).toLowerCase()
    );
  });
};

export function countNonAttendedProfessions(
  usersShifts: IUserShift[],
): { profession: string; reason: string; count: number; sortOrder: number }[] {
  // Расширяем тип вложенного объекта: добавляем statusIndex
  const resultMap: Record<
    string,
    Record<string, { count: number; sortOrder: number; statusIndex: number }>
  > = {};

  const statusAbbreviations = transformWorkStatusOptions();

  usersShifts.forEach((userShift) => {
    if (
      userShift.workStatus === 'Явка' ||
      userShift.workPlace === 'Не выбрано'
    ) {
      return;
    }

    const profession = userShift.shiftProfession;
    const status = userShift.workStatus as TWorkStatus;

    const reason =
      statusAbbreviations[WORK_STATUS_OPTIONS.indexOf(status)] ||
      status.slice(0, 2).toLowerCase();

    const statusIndex = statusAbbreviations.indexOf(reason);

    if (!resultMap[profession]) {
      resultMap[profession] = {};
    }

    if (!resultMap[profession][reason]) {
      resultMap[profession][reason] = {
        count: 0,
        sortOrder: userShift.user?.sortOrder ?? 0,
        statusIndex: statusIndex, // теперь тип включает statusIndex
      };
    }

    resultMap[profession][reason].count++;
  });

  const result = Object.keys(resultMap).reduce(
    (acc, profession) => {
      const reasons = Object.keys(resultMap[profession]);
      reasons.forEach((reason) => {
        acc.push({
          profession,
          reason,
          count: resultMap[profession][reason].count,
          sortOrder: resultMap[profession][reason].sortOrder,
          statusIndex: resultMap[profession][reason].statusIndex, // используем поле
        });
      });
      return acc;
    },
    [] as {
      profession: string;
      reason: string;
      count: number;
      sortOrder: number;
      statusIndex: number; // добавляем в тип массива
    }[],
  );

  return (
    result
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        return a.statusIndex - b.statusIndex;
      })
      // Удаляем statusIndex из итогового объекта (если не нужен снаружи)
      .map(({ profession, reason, count, sortOrder }) => ({
        profession,
        reason,
        count,
        sortOrder,
      }))
  );
}

export function filterWorkers(usersShifts: IUserShift[]): IUserShift[] {
  const profession: TProfession = 'Мастер участка';
  const masterRole: TRole = 'MASTER';

  // Проверяем, есть ли пользователь с профессией 'Мастер участка'
  const hasMasterProfession = usersShifts.some(
    (userShift) => userShift.user?.profession === profession,
  );

  if (hasMasterProfession) {
    // Если есть мастер по профессии — фильтруем его
    return usersShifts.filter(
      (userShift) => userShift.user?.profession !== profession,
    );
  }

  // Если нет мастера по профессии — ищем по роли
  const hasMasterRole = usersShifts.some(
    (userShift) => userShift.user?.role === masterRole,
  );

  if (hasMasterRole) {
    // Если есть мастер по роли — фильтруем его
    return usersShifts.filter(
      (userShift) => userShift.user?.role !== masterRole,
    );
  }

  // Если ни мастера по профессии, ни по роли не найдено — возвращаем пустой массив
  return usersShifts;
}

export function filterMaster(usersShifts: IUserShift[]) {
  const profession: TProfession = 'Мастер участка';
  const masterRole: TRole = 'MASTER';

  // Ищем пользователя с профессией 'Мастер участка'
  const masterByProfession = usersShifts.find(
    (userShift) =>
      userShift.user?.profession === profession &&
      userShift.user?.role === masterRole,
  );

  if (masterByProfession) {
    // Если найден мастер по профессии — возвращаем его
    return masterByProfession;
  }

  // Если нет мастера по профессии — ищем по роли
  const masterByRole = usersShifts.find(
    (userShift) => userShift.user?.role === masterRole,
  );

  if (masterByRole) {
    // Если найден мастер по роли — возвращаем его
    return masterByRole;
  }

  return;
}

export function getPackerStats(usersShifts: IUserShift[]) {
  const packer: TProfession = 'Укладчик-упаковщик';
  const attendance: TWorkStatus = 'Явка';

  const statsMap = new Map<
    string,
    { profession: string; workplace: string; count: number }
  >();

  usersShifts.forEach((item) => {
    // 1. Строгая проверка профессии: только "Укладчик-упаковщик" (без ЛУМ и др.)
    if (item.shiftProfession !== packer) {
      return;
    }

    // 2. Проверка статуса: только "Явка"
    if (item.workStatus !== attendance) {
      return;
    }

    // 3. Проверка рабочего места: только 1/2/3 очередь
    const validWorkplaces = ['1 очередь', '2 очередь', '3 очередь'];
    if (!validWorkplaces.includes(item.workPlace)) {
      return;
    }

    // 4. Ключ для группировки: профессия + рабочее место
    const key = `${item.shiftProfession}_${item.workPlace}`;

    if (statsMap.has(key)) {
      statsMap.get(key)!.count++;
    } else {
      statsMap.set(key, {
        profession: item.shiftProfession,
        workplace: item.workPlace,
        count: 1,
      });
    }
  });

  return Array.from(statsMap.values()).sort((a, b) =>
    a.workplace.localeCompare(b.workplace),
  );
}

export function getShipmentStats(usersShifts: IUserShift[]) {
  const shipment: TProfession = 'Штабелировщик металла';
  const attendance: TWorkStatus = 'Явка';

  const statsMap = new Map<
    string,
    { profession: string; workplace: string; count: number }
  >();

  usersShifts.forEach((item) => {
    // 1. Строгая проверка профессии: только "Укладчик-упаковщик" (без ЛУМ и др.)
    if (item.shiftProfession !== shipment) {
      return;
    }

    // 2. Проверка статуса: только "Явка"
    if (item.workStatus !== attendance) {
      return;
    }

    // 3. Проверка рабочего места: только 1/2/3 очередь
    const validWorkplaces = ['1 очередь', '2 очередь', '3 очередь'];
    if (!validWorkplaces.includes(item.workPlace)) {
      return;
    }

    // 4. Ключ для группировки: профессия + рабочее место
    const key = `${item.shiftProfession}_${item.workPlace}`;

    if (statsMap.has(key)) {
      statsMap.get(key)!.count++;
    } else {
      statsMap.set(key, {
        profession: item.shiftProfession,
        workplace: item.workPlace,
        count: 1,
      });
    }
  });

  return Array.from(statsMap.values()).sort((a, b) =>
    a.workplace.localeCompare(b.workplace),
  );
}

export function transformLocations(data: IPack[]): IPack[] {
  // Шаг 1. Преобразуем location согласно правилам
  const transformedData = data.map((item) => {
    let newLocation: string | undefined;

    if (item.area === 'Ручная упаковка') {
      if (item.location) {
        const number = item.location.split(' ')[0];
        newLocation = `${number} ОЧ`;
      } else {
        newLocation = undefined;
      }
    } else if (item.area === 'ЛУМ') {
      newLocation = 'ЛУМ';
    } else {
      newLocation = item.location;
    }

    return {
      ...item,
      location: newLocation,
    };
  });

  // Шаг 2. Сортируем по заданному приоритету
  return transformedData.sort((a, b) => {
    const order: Record<string, number> = {
      ЛУМ: 0,
      '1 ОЧ': 1,
      '2 ОЧ': 2,
      '3 ОЧ': 3,
    };

    const aKey = a.location ?? '';
    const bKey = b.location ?? '';

    // Если значение есть в order — берём его приоритет, иначе ставим в конец (Infinity)
    const aPriority = order[aKey] ?? Infinity;
    const bPriority = order[bKey] ?? Infinity;

    return aPriority - bPriority;
  });
}

export function transformResidueLocations(data: IResidue[]): IResidue[] {
  return data.map((item) => {
    let newLocation: string | undefined; // Сохраняем тип как в интерфейсе

    if (item.area === 'Ручная упаковка') {
      // Проверяем, что item.location существует и не пустое
      if (item.location) {
        const number = item.location.split(' ')[0];
        newLocation = `${number} ОЧ`;
      } else {
        newLocation = undefined; // Или можно задать значение по умолчанию, например: 'Неизвестно ОЧ'
      }
    } else if (item.area === 'ВЛРТ') {
      newLocation = 'ВЛРТ'; // Исправлено: было newDecoration
    } else {
      // Если area не совпадает — оставляем location как есть (может быть undefined)
      newLocation = item.location;
    }

    return {
      ...item,
      location: newLocation,
    };
  });
}

export function filterAndSortProfessions(
  data: {
    profession: string;
    count: number;
    sortOrder: number;
  }[],
): {
  profession: string;
  count: number;
  sortOrder: number;
}[] {
  const requiredProfessions = ['Оператор ПУ', 'Укладчик-упаковщик ЛУМ'];

  return data
    .filter((item) => requiredProfessions.includes(item.profession))
    .sort((a, b) => {
      // Определяем индекс профессии в требуемом порядке
      const indexA = requiredProfessions.indexOf(a.profession);
      const indexB = requiredProfessions.indexOf(b.profession);
      return indexA - indexB;
    });
}

export function extractNumber(railway: string) {
  const match = railway.match(/Тупик\s+(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export function countProfessionsBySickLeave(
  shifts: IShift[],
): { profession: string; count: number }[] {
  // 1. Собираем всех сотрудников на больничном с их sortOrder
  const sickUsers: { profession: string; sortOrder: number }[] = [];

  for (const shift of shifts) {
    const users = shift.usersShifts ?? [];

    for (const user of users) {
      if (
        user?.workStatus === 'Больничный лист' &&
        user.user?.sortOrder != null
      ) {
        sickUsers.push({
          profession: user.shiftProfession,
          sortOrder: user.user.sortOrder,
        });
      }
    }
  }

  // 2. Сортируем по sortOrder (по возрастанию)
  sickUsers.sort((a, b) => a.sortOrder - b.sortOrder);

  // 3. Считаем количество профессий, сохраняя порядок сортировки
  const counts: Record<string, number> = {};
  const order: string[] = []; // Чтобы запомнить порядок профессий по sortOrder

  for (const { profession } of sickUsers) {
    if (!counts[profession]) {
      counts[profession] = 1;
      order.push(profession); // Первая встреча профессии — добавляем в порядок
    } else {
      counts[profession]++;
    }
  }

  // 4. Формируем результат в порядке сортировки
  return order.map((profession) => ({
    profession,
    count: counts[profession],
  }));
}

export function useToggleAfterDelay(delay = 1000) {
  const [value, setValue] = useState(true); // Изначально true

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(false); // Через delay мс меняем на false
    }, delay);

    return () => clearTimeout(timer); // Очистка при удалении компонента
  }, [delay]); // Перезапускаем эффект при изменении delay

  return value;
}
