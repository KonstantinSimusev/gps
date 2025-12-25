import { createAsyncThunk } from '@reduxjs/toolkit';

import { updateProductionApi } from '../../../utils/api/production.api';

import { IProduction, ISuccess } from '../../../utils/api.interface';

import { delay } from '../../../utils/utils';

export const updateProduction = createAsyncThunk(
  'production/update',
  async (payload: IProduction): Promise<ISuccess> => {
    try {
      // Вызываем API функцию
      const response = await updateProductionApi(payload);

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
