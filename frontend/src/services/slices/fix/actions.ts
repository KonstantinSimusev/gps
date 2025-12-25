import { createAsyncThunk } from '@reduxjs/toolkit';

import { updateFixApi } from '../../../utils/api/fix.api';

import { IFix, ISuccess } from '../../../utils/api.interface';

import { delay } from '../../../utils/utils';

export const updateFix = createAsyncThunk(
  'fix/update',
  async (payload: IFix): Promise<ISuccess> => {
    try {
      // Вызываем API функцию
      const response = await updateFixApi(payload);

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
