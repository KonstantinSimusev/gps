import { createAsyncThunk } from '@reduxjs/toolkit';

import { getPacksApi, updatePackApi } from '../../../utils/api/pack.api';

import { IList, IPack, ISuccess } from '../../../utils/api.interface';

import { delay } from '../../../utils/utils';

export const getPacks = createAsyncThunk(
  'shift/pack',
  async (shiftId: string): Promise<IList<IPack>> => {
    try {
      const response = await getPacksApi(shiftId);

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

export const updatePack = createAsyncThunk(
  'pack/update',
  async (payload: IPack): Promise<ISuccess> => {
    try {
      // Вызываем API функцию
      const response = await updatePackApi(payload);

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
