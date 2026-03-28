import { createAsyncThunk } from '@reduxjs/toolkit';

import { getEmployeeInfoApi } from '../../../utils/api/employee.api';
import { IEmployeeInfo } from '../../../utils/api.interface';
import { delay } from '../../../utils/utils';

export const getEmployeeInfo = createAsyncThunk(
  'employees/personalNumber',
  async (personalNumber: string): Promise<IEmployeeInfo> => {
    try {
      // Вызываем API функцию
      const response = await getEmployeeInfoApi(personalNumber);

      // Добавляем задержку кода
      await delay();

      return response;
    } catch (error) {
      // Добавляем задержку кода
      await delay();

      throw new Error('Работник не найден');
    }
  },
);
