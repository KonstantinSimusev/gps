import type { IEmployeeInfo } from '../api.interface';

// Используем переменную окружения
export const URL = import.meta.env.VITE_API_URL ?? '/api/gps';

export const getEmployeeInfoApi = async (
  personalNumber: string,
): Promise<IEmployeeInfo> => {
  try {
    const response = await fetch(`${URL}/employees/${personalNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      credentials: 'include', // Важно добавить эту строку
    });

    if (!response.ok) {
      throw new Error();
    }

    // Правильно парсим JSON и возвращаем объект
    return await response.json();
  } catch (error) {
    throw new Error();
  }
};
