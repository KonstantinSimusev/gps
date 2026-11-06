import { BASE_PATH } from '../api.config';
import {
  ICreateEmployeeShift,
  IDeleteEmployeeShift,
  ISuccess,
  IUpdateEmployeeShift,
} from '../api.interfaces';

export const createEmployeeShiftApi = async (
  data: ICreateEmployeeShift,
): Promise<ISuccess> => {
  try {
    const response = await fetch(`${BASE_PATH}/employee-shift-management`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      credentials: 'include',
      body: JSON.stringify(data),
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

export const updateEmployeeShiftApi = async (
  data: IUpdateEmployeeShift,
): Promise<ISuccess> => {
  try {
    const response = await fetch(`${BASE_PATH}/employee-shift-management`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      credentials: 'include',
      body: JSON.stringify(data),
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

export const deleteEmployeeShiftApi = async (
  data: IDeleteEmployeeShift,
): Promise<ISuccess> => {
  try {
    const url = `${BASE_PATH}/employee-shift-management`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      credentials: 'include',
      body: JSON.stringify(data),
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
