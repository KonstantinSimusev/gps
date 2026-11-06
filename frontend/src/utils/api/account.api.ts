import { BASE_PATH } from '../api.config';
import { IAccountInfo } from '../api.interfaces';

export const updateLoginAndPasswordApi = async (
  id: string,
): Promise<IAccountInfo> => {
  try {
    const url = `${BASE_PATH}/employee-account/${id}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
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
