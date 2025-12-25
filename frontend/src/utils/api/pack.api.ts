import type { IPack, ISuccess } from '../api.interface';

// Используем переменную окружения
export const URL = import.meta.env.VITE_API_URL ?? '/api/gps';

export const updatePackApi = async (payload: IPack): Promise<ISuccess> => {
  try {
    // Здесь происходит запрос к серверу
    const response = await fetch(`${URL}/packs/update-pack`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      credentials: 'include', // Важно для работы с cookie
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    // Если все хорошо, возвращаем данные
    return await response.json();
  } catch (error) {
    // Сюда попадаем при любом throw new Error()
    throw error;
  }
};
