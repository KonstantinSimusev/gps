import { createAsyncThunk } from '@reduxjs/toolkit';

import { IAccountInfo } from '../../../utils/api.interfaces';
import { updateLoginAndPasswordApi } from '../../../utils/api/account.api';
import { delay } from '../../../utils/utils';

export const updateLoginAndPassword = createAsyncThunk(
  'account/update',
  async (id: string): Promise<IAccountInfo> => {
    try {
      // Вызываем API функцию
      const response = await updateLoginAndPasswordApi(id);
await delay(1000);
      return response;
    } catch (error) {
      if (error instanceof Error) {
await delay(1000);
        throw error; // передаём точное сообщение от бэкенда
      }

      throw new Error('Что-то пошло не так');
    }
  },
);

// Добавляем задержку кода
// await delay(1000);
