import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  checkAccessTokenApi,
  loginUserApi,
  logoutUserApi,
} from '../../../utils/api/auth.api';

import { IEmployee, ILoginData, ISuccess } from '../../../utils/api.interface';

import { delay } from '../../../utils/utils';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: ILoginData): Promise<IEmployee> => {
    try {
      // Вызываем API функцию
      const response = await loginUserApi(data);

      // Добавляем задержку кода
      await delay();

      return response;
    } catch (error) {
      // Добавляем задержку кода
      await delay();

      throw new Error('Неверный логин или пароль');
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (): Promise<ISuccess> => {
    try {
      const response = await logoutUserApi();

      // Добавляем задержку кода
      await delay();

      if (!response) {
        throw new Error();
      }

      return response;
    } catch (error) {
      // Добавляем задержку кода
      await delay();

      throw error;
    }
  },
);

export const checkAccessToken = createAsyncThunk(
  'auth/refreshToken',
  async (): Promise<ISuccess> => {
    try {
      const response = await checkAccessTokenApi();

      // Добавляем задержку кода
      // await delay();

      if (!response) {
        throw new Error();
      }

      return response;
    } catch (error) {
      // Добавляем задержку кода
      // await delay();

      // Пойдет в checkAccessToken.rejected в authSlice
      throw error;
    }
  },
);
