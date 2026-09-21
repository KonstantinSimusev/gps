import { createAsyncThunk } from '@reduxjs/toolkit';

import { delay } from '../../../utils/utils';
import { IEmployeeShiftList } from '../../../utils/api.interface';
import { getEmployeeShiftsByShiftIdApi } from '../../../utils/api/employee-shift.api';

export const getEmployeeShiftsByShiftId = createAsyncThunk(
  'employee-shift/byShiftId',
  async (shiftId: string): Promise<IEmployeeShiftList> => {
    try {
      // Вызываем API функцию
      const response = await getEmployeeShiftsByShiftIdApi(shiftId);

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
