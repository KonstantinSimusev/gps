import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  IAccountInfo,
  ICreateEmployee,
  IEmployeeInfo,
  IUpdateEmployee,
} from '../../../utils/api.interfaces';

import {
  createEmployeeApi,
  searchEmployeeApi,
  updateEmployeeApi,
} from '../../../utils/api/employee.api';
// import { delay } from '../../../utils/utils';

export const createEmployee = createAsyncThunk(
  'employee/create',
  async (data: ICreateEmployee): Promise<IAccountInfo> => {
    try {
      // Вызываем API функцию
      const response = await createEmployeeApi(data);
// await delay(1000);
      return response;
    } catch (error) {
// await delay(1000);
      if (error instanceof Error) {
        throw error; // передаём точное сообщение от бэкенда
      }

      throw new Error('Что-то пошло не так');
    }
  },
);

export const updateEmployee = createAsyncThunk(
  'employee/update',
  async (data: IUpdateEmployee): Promise<IEmployeeInfo> => {
    try {
      // Вызываем API функцию
      const response = await updateEmployeeApi(data);
// await delay(1000);
      return response;
    } catch (error) {
      if (error instanceof Error) {
// await delay(1000);
        throw error; // передаём точное сообщение от бэкенда
      }

      throw new Error('Что-то пошло не так');
    }
  },
);

export const searchEmployee = createAsyncThunk(
  'employees/personalNumber',
  async (personalNumber: string): Promise<IEmployeeInfo> => {
    try {
      // Вызываем API функцию
      const response = await searchEmployeeApi(personalNumber);
// await delay(1000);
      return response;
    } catch (error) {
// await delay(1000);
      if (error instanceof Error) {
        throw error; // передаём точное сообщение от бэкенда
      }

      throw new Error('Что-то пошло не так');
    }
  },
);

// Добавляем задержку кода
// await delay(1000);
