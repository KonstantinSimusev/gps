import type { IShift, ISuccess } from '../api.interface';

// Используем переменную окружения
export const URL = import.meta.env.VITE_API_URL ?? '/api/gps';

export const createShiftsApi = async (): Promise<IShift[]> => {
  try {
    // Здесь происходит запрос к серверу
    const response = await fetch(`${URL}/shift-management`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      credentials: 'include', // Важно для работы с cookie
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    // Правильно парсим JSON и возвращаем объект
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Что-то пошло не так');
  }
};

// export const createMissingShiftsApi = async (): Promise<ISuccess> => {
//   try {
//     const url = `${URL}/shift-management/missing-shifts`;

//     // Здесь происходит запрос к серверу
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8',
//       },
//       credentials: 'include', // Важно для работы с cookie
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message);
//     }

//     // Правильно парсим JSON и возвращаем объект
//     return await response.json();
//   } catch (error) {
//     if (error instanceof Error) {
//       throw error;
//     }

//     throw new Error('Что-то пошло не так');
//   }
// };

export const getShiftsApi = async (): Promise<IShift[]> => {
  try {
    const response = await fetch(`${URL}/shift-management/shifts`, {
      method: 'GET',
      credentials: 'include', // Важно добавить эту строку
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    // Правильно парсим JSON и возвращаем объект
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Что-то пошло не так');
  }
};

// export const getUncheckedShiftsApi = async (): Promise<IShift[]> => {
//   try {
//     const url = `${URL}/shift-management/unchecked-shifts`;

//     // Здесь происходит запрос к серверу
//     const response = await fetch(url, {
//       method: 'GET',
//       credentials: 'include', // Важно для работы с cookie
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message);
//     }

//     // Правильно парсим JSON и возвращаем объект
//     return await response.json();
//   } catch (error) {
//     if (error instanceof Error) {
//       throw error;
//     }

//     throw new Error('Что-то пошло не так');
//   }
// };

export const getShiftByIdApi = async (id: string): Promise<IShift> => {
  try {
    const url = `${URL}/shift-management/shift/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Что-то пошло не так');
  }
};

export const getShiftsByDateApi = async (
  shiftDate: string, // YYYY-MM-DD
): Promise<IShift[]> => {
  try {
    const url = `${URL}/shift-management/shifts/${shiftDate}`;

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include', // Важно добавить эту строку
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    // Правильно парсим JSON и возвращаем объект
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Что-то пошло не так');
  }
};

export const setCheckedByShiftIdApi = async (
  shiftId: string,
): Promise<ISuccess | string> => {
  const response = await fetch(`${URL}/shifts/${shiftId}/check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    credentials: 'include', // Важно добавить эту строку
  });

  if (!response.ok) {
    // .catch() защищает от падения, если сервер вернул не JSON (HTML, текст, пусто)
    const errorData = await response.json().catch(() => ({
      message: `Ошибка сервера: ${response.status}`,
    }));
    return errorData.message; // <-- Возвращаем строку, а не throw
  }

  // Правильно парсим JSON и возвращаем объект
  return await response.json();
};
