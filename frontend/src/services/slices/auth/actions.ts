import { createAsyncThunk } from '@reduxjs/toolkit';

import { IProfile, ILoginData, ISuccess } from '../../../utils/api.interfaces';

import {
  checkAccessTokenApi,
  loginEmployeeApi,
  logoutEmployeeApi,
} from '../../../utils/api/auth.api';
// import { delay } from '../../../utils/utils';

export const loginEmployee = createAsyncThunk(
  'auth/login',
  async (data: ILoginData): Promise<IProfile> => {
    try {
      // Вызываем API функцию
      const response = await loginEmployeeApi(data);
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

export const checkAccessToken = createAsyncThunk(
  'auth/refreshToken',
  async (): Promise<IProfile> => {
    try {
      const response = await checkAccessTokenApi();

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error; // передаём точное сообщение от бэкенда
      }

      throw new Error('Что-то пошло не так');
    }
  },
);

export const logoutEmployee = createAsyncThunk(
  'auth/logout',
  async (): Promise<ISuccess> => {
    try {
      const response = await logoutEmployeeApi();
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

// Добавляем задержку кода
// await delay(1000);
