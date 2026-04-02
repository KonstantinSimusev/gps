import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  createEmployeeApi,
  searchEmployeeApi,
} from '../../../utils/api/employee.api';

import {
  IAccountInfo,
  ICreateEmployee,
  IEmployeeInfo,
} from '../../../utils/api.interface';

import { delay } from '../../../utils/utils';

export const searchEmployee = createAsyncThunk(
  'employees/personalNumber',
  async (personalNumber: string): Promise<IEmployeeInfo> => {
    try {
      // Вызываем API функцию
      const response = await searchEmployeeApi(personalNumber);

      // Добавляем задержку кода
      await delay();

      return response;
    } catch (error) {
      // Добавляем задержку кода
      await delay();

      if (error instanceof Error) {
        throw error; // передаём точное сообщение от бэкенда
      }

      throw new Error('Что-то пошло не так');
    }
  },
);

export const createEmployee = createAsyncThunk(
  'employee/create',
  async (data: ICreateEmployee): Promise<IAccountInfo> => {
    try {
      // Вызываем API функцию
      const response = await createEmployeeApi(data);

      // Добавляем задержку кода
      await delay();

      return response;
    } catch (error) {
      // Добавляем задержку кода
      await delay();

      if (error instanceof Error) {
        throw error; // передаём точное сообщение от бэкенда
      }

      throw new Error('Что-то пошло не так');
    }
  },
);
