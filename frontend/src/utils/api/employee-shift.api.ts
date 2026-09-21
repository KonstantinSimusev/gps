import type { IEmployeeShiftList } from '../api.interface';

// Используем переменную окружения
export const URL = import.meta.env.VITE_API_URL ?? '/api/gps';

export const getEmployeeShiftsByShiftIdApi = async (
  shiftId: string,
): Promise<IEmployeeShiftList> => {
  try {
    const response = await fetch(`${URL}/employee-shift/${shiftId}`, {
      method: 'GET',
      // headers: {
      //   'Content-Type': 'application/json;charset=utf-8',
      // },
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
