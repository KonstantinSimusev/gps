import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getFixsApi,
  updateFixApi,
} from '../../../utils/api/fix.api';

import { IList, IFix, ISuccess } from '../../../utils/api.interface';

import { delay } from '../../../utils/utils';

export const getFixs = createAsyncThunk(
  'shift/fix',
  async (shiftId: string): Promise<IList<IFix>> => {
    try {
      const response = await getFixsApi(shiftId);

      // Добавляем задержку кода
      await delay();

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
      // await delay();

      throw error;
    }
  },
);
