import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  checkAccessTokenApi,
  loginEmployeeApi,
  logoutEmployeeApi,
} from '../../../utils/api/auth.api';

import { IProfile, ILoginData, ISuccess } from '../../../utils/api.interface';

import { delay } from '../../../utils/utils';
// import { setRoleStatusApi } from '../../../utils/api/role.api';

export const loginEmployee = createAsyncThunk(
  'auth/login',
  async (data: ILoginData): Promise<IProfile> => {
    try {
      // Вызываем API функцию
      const response = await loginEmployeeApi(data);

      // Добавляем задержку кода
      await delay();

      return response;
    } catch (error) {
      // Добавляем задержку кода
      await delay();

      throw new Error('Доступ запрещён');
    }
  },
);

export const checkAccessToken = createAsyncThunk(
  'auth/refreshToken',
  async (): Promise<IProfile> => {
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

// export const setRoleStatus = createAsyncThunk(
//   'fix/update',
//   async (payload: { isRoleActive: boolean }): Promise<ISuccess> => {
//     try {
//       // Вызываем API функцию
//       const response = await setRoleStatusApi(payload);

//       // Добавляем задержку кода
//       await delay();

//       if (!response) {
//         throw new Error();
//       }

//       return response;
//     } catch (error) {
//       // Добавляем задержку кода
//       await delay();

//       throw error;
//     }
//   },
// );

export const logoutEmployee = createAsyncThunk(
  'auth/logout',
  async (): Promise<ISuccess> => {
    try {
      const response = await logoutEmployeeApi();

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
