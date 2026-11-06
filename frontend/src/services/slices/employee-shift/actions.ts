import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  ICreateEmployeeShift,
  IDeleteEmployeeShift,
  ISuccess,
  IUpdateEmployeeShift,
} from '../../../utils/api.interfaces';

import {
  createEmployeeShiftApi,
  deleteEmployeeShiftApi,
  updateEmployeeShiftApi,
} from '../../../utils/api/employee-shift.api';
import { delay } from '../../../utils/utils';

export const createEmployeeShift = createAsyncThunk<
  ISuccess,
  ICreateEmployeeShift
>(
  'employee-shift/create',
  async (data: ICreateEmployeeShift): Promise<ISuccess> => {
    try {
      const response = await createEmployeeShiftApi(data);
      await delay(1000);
      return response;
    } catch (error) {
      await delay(1000);
      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Что-то пошло не так');
    }
  },
);

export const updateEmployeeShift = createAsyncThunk<
  ISuccess,
  IUpdateEmployeeShift
>(
  'employee-shift/update',
  async (data: IUpdateEmployeeShift): Promise<ISuccess> => {
    try {
      const response = await updateEmployeeShiftApi(data);
      await delay(1000); // задержка для теста лоадера
      return response;
    } catch (error) {
      await delay(1000); // задержка и при ошибке — чтобы лоадер успел отрисоваться
      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Что-то пошло не так');
    }
  },
);

export const deleteEmployeeShift = createAsyncThunk<
  ISuccess,
  IDeleteEmployeeShift
>(
  'employee-shift/delete',
  async (data: IDeleteEmployeeShift): Promise<ISuccess> => {
    try {
      const response = await deleteEmployeeShiftApi(data);
      await delay(1000); // задержка для теста лоадера
      return response;
    } catch (error) {
      await delay(1000); // задержка и при ошибке — чтобы лоадер успел отрисоваться
      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Что-то пошло не так');
    }
  },
);

// Добавляем задержку кода
// await delay(1000);
