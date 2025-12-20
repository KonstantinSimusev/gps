import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getResiduesApi,
  updateResidueApi,
} from '../../../utils/api/residue.api';

import { IList, IResidue, ISuccess } from '../../../utils/api.interface';

import { delay } from '../../../utils/utils';

export const getResidues = createAsyncThunk(
  'shift/residue',
  async (shiftId: string): Promise<IList<IResidue>> => {
    try {
      const response = await getResiduesApi(shiftId);

      // Добавляем задержку кода
      await delay();

      if (!response) {
        throw new Error();
      }

      return response;
    } catch (error) {
      // Добавляем задержку кода
      await delay();

      // Пойдет в rejected
      throw error;
    }
  },
);

export const updateResidue = createAsyncThunk(
  'residue/update',
  async (payload: IResidue): Promise<ISuccess> => {
    try {
      // Вызываем API функцию
      const response = await updateResidueApi(payload);

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
