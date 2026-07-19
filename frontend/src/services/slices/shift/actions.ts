import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  // IAccountInfo,
  // ICreateEmployee,
  // ICreateShift,
  // IEmployeeInfo,
  ISuccess,
  // IUpdateEmployee,
} from '../../../utils/api.interface';

// import { delay } from '../../../utils/utils';

import {
  createShiftApi,
  getCurrentShiftsApi,
} from '../../../utils/api/shift.api';

export const createShift = createAsyncThunk(
  'shift/create',
  async (): Promise<ISuccess> => {
    try {
      // Вызываем API функцию
      const response = await createShiftApi();

      // Добавляем задержку кода
      // await delay();

      return response;
    } catch (error) {
      // Добавляем задержку кода
      // await delay();

      if (error instanceof Error) {
        throw error; // передаём точное сообщение от бэкенда
      }

      throw new Error('Что-то пошло не так');
    }
  },
);

export const getCurrentShifts = createAsyncThunk(
  'current-shifts/get',
  async () => {
    try {
      // Вызываем API функцию
      const response = await getCurrentShiftsApi();

      // Добавляем задержку кода
      // await delay();

      return response;
    } catch (error) {
      // Добавляем задержку кода
      // await delay();

      if (error instanceof Error) {
        throw error; // передаём точное сообщение от бэкенда
      }

      throw new Error('Что-то пошло не так');
    }
  },
);
