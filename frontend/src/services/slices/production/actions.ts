import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getProductionsApi,
  updateProductionApi,
} from '../../../utils/api/production.api';

import { IList, IProduction, ISuccess } from '../../../utils/api.interface';

import { delay } from '../../../utils/utils';

export const getProductions = createAsyncThunk(
  'shift/productions',
  async (shiftId: string): Promise<IList<IProduction>> => {
    try {
      const response = await getProductionsApi(shiftId);

      // Добавляем задержку кода
      // await delay();

      if (!response) {
        throw new Error();
      }

      return response;
    } catch (error) {
      // Добавляем задержку кода
      // await delay();

      // Пойдет в rejected
      throw error;
    }
  },
);

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
      // await delay();

      throw error;
    }
  },
);
