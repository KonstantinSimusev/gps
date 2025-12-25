import type { IList, IShift, ISuccess } from '../api.interface';

// Используем переменную окружения
export const URL = import.meta.env.VITE_API_URL ?? '/api/gps';

export const createShiftApi = async (data: IShift): Promise<ISuccess> => {
  try {
    // Здесь происходит запрос к серверу
    const response = await fetch(`${URL}/shifts/create-shift`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      credentials: 'include', // Важно для работы с cookie
      body: JSON.stringify(data),
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

export const getActiveShiftApi = async (): Promise<IShift> => {
  try {
    // Здесь происходит запрос к серверу
    const response = await fetch(`${URL}/shifts/active-shift`, {
      method: 'GET',
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
    // Сюда попадаем при любом throw new Error()
    throw error;
  }
};

export const getFinishedShiftApi = async (): Promise<IShift> => {
  try {
    // Здесь происходит запрос к серверу
    const response = await fetch(`${URL}/shifts/finished-shift`, {
      method: 'GET',
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
    // Сюда попадаем при любом throw new Error()
    throw error;
  }
};

export const getLastTeamShiftApi = async (): Promise<IShift | null> => {
  try {
    // Здесь происходит запрос к серверу
    const response = await fetch(`${URL}/shifts/last-team-shift`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      credentials: 'include', // Важно для работы с cookie
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    // Сюда попадаем при любом throw new Error()
    throw error;
  }
};

export const getLastShiftsTeamsApi = async (): Promise<IList<IShift>> => {
  try {
    // Здесь происходит запрос к серверу
    const response = await fetch(`${URL}/shifts/last-shifts-teams`, {
      method: 'GET',
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
    // Сюда попадаем при любом throw new Error()
    throw error;
  }
};
