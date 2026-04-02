import type { IProfile, ILoginData, ISuccess } from '../api.interface';

// Используем переменную окружения
export const URL = import.meta.env.VITE_API_URL ?? '/api/gps';

export const loginEmployeeApi = async (data: ILoginData): Promise<IProfile> => {
  try {
    const response = await fetch(`${URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Важно добавить эту строку
      body: JSON.stringify(data),
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

export const checkAccessTokenApi = async (): Promise<IProfile> => {
  try {
    // Здесь происходит запрос к серверу
    const response = await fetch(`${URL}/auth/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      credentials: 'include', // Важно для работы с cookie
    });

    if (!response.ok) {
      // Если ответ не успешный, создаем ошибку, происходит переход в catch
      throw new Error();
    }

    // Если все хорошо, возвращаем данные
    return await response.json();
  } catch (error) {
    // Сюда попадаем при любом throw new Error
    throw error;
  }
};

export const logoutEmployeeApi = async (): Promise<ISuccess> => {
  try {
    const response = await fetch(`${URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Важно для работы с cookie
    });

    if (!response.ok) {
      throw new Error('Ошибка при выходе из системы');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
