import { BASE_PATH } from '../api.config';
import type { IShift } from '../api.interfaces';

// export const createShiftsApi = async (): Promise<IShift[]> => {
//   try {
//     // Здесь происходит запрос к серверу
//     const response = await fetch(`${URL}/shift-management`, {
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
    const response = await fetch(`${BASE_PATH}/shift-management/shifts`, {
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

export const getShiftByIdApi = async (id: string): Promise<IShift> => {
  try {
    const url = `${BASE_PATH}/shift-management/shifts/${id}`;

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
    const url = `${BASE_PATH}/shift-management/shifts/date/${shiftDate}`;

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

// export const setCheckedByShiftIdApi = async (
//   shiftId: string,
// ): Promise<ISuccess> => {
//   try {
//     const url = `${URL}/shifts/${shiftId}/check`;

//     const res = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8',
//       },
//       credentials: 'include', // Важно добавить эту строку
//     });
//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData.message);
//     }

//     // Правильно парсим JSON и возвращаем объект
//     return await res.json();
//   } catch (error) {
//     if (error instanceof Error) {
//       throw error;
//     }

//     throw new Error('Что-то пошло не так');
//   }
// };
