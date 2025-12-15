import type {
  ICreateUserShift,
  IList,
  ISuccess,
  IUserShift,
} from '../api.interface';

// Используем переменную окружения
export const URL = import.meta.env.VITE_API_URL ?? '/api/gps';

export const createUserShiftApi = async (
  payload: ICreateUserShift,
): Promise<IUserShift> => {
  try {
    // Здесь происходит запрос к серверу
    const response = await fetch(`${URL}/users-shifts/create-user-shift`, {
      method: 'POST',
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

export const getUsersShiftsApi = async (
  shiftId: string,
): Promise<IList<IUserShift>> => {
  try {
    // Здесь происходит запрос к серверу
    const response = await fetch(`${URL}/shifts/${shiftId}/users-shifts`, {
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

export const updateUserShiftApi = async (
  payload: IUserShift,
): Promise<ISuccess> => {
  try {
    // Здесь происходит запрос к серверу
    const response = await fetch(`${URL}/users-shifts/update-user-shift`, {
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

export const deleteUserShiftApi = async (id: string): Promise<ISuccess> => {
  try {
    const response = await fetch(`${URL}/users-shifts/delete-user-shift`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error();
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
