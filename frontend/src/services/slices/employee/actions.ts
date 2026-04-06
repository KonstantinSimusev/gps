import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  createEmployeeApi,
  deleteEmployeeApi,
  searchEmployeeApi,
  updateEmployeeApi,
} from '../../../utils/api/employee.api';

import {
  IAccountInfo,
  ICreateEmployee,
  IEmployeeInfo,
  ISuccess,
  IUpdateEmployee,
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

export const updateEmployee = createAsyncThunk(
  'employee/update',
  async (payload: {
    id: string;
    data: IUpdateEmployee;
  }): Promise<IEmployeeInfo> => {
    try {
      const { id, data } = payload;

      // Вызываем API функцию
      const response = await updateEmployeeApi(id, data);

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

export const deleteEmployee = createAsyncThunk(
  'employee/delete',
  async (id: string): Promise<ISuccess> => {
    try {
      // Вызываем API функцию
      const response = await deleteEmployeeApi(id);

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
