import { createAsyncThunk } from '@reduxjs/toolkit';

import { IAccountInfo } from '../../../utils/api.interface';
import { delay } from '../../../utils/utils';
import { updateLoginAndPasswordApi } from '../../../utils/api/account.api';

export const updateLoginAndPassword = createAsyncThunk(
  'account/update',
  async (id: string): Promise<IAccountInfo> => {
    try {
      // Вызываем API функцию
      const response = await updateLoginAndPasswordApi(id);

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
