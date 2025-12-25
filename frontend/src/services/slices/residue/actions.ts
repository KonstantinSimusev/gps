import { createAsyncThunk } from '@reduxjs/toolkit';

import { updateResidueApi } from '../../../utils/api/residue.api';

import { IResidue, ISuccess } from '../../../utils/api.interface';

// import { delay } from '../../../utils/utils';

export const updateResidue = createAsyncThunk(
  'residue/update',
  async (payload: IResidue): Promise<ISuccess> => {
    try {
      // Вызываем API функцию
      const response = await updateResidueApi(payload);

      // Добавляем задержку кода
      // await delay();

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
