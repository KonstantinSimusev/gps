import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  createUserShiftApi,
  deleteUserShiftApi,
  getUsersShiftsApi,
  updateUserShiftApi,
} from '../../../utils/api/user-shift.api';

import {
  ICreateUserShift,
  IList,
  ISuccess,
  IUserShift,
} from '../../../utils/api.interface';

import { delay } from '../../../utils/utils';

export const createUserShift = createAsyncThunk(
  'users-shifts/create-shift',
  async (payload: ICreateUserShift): Promise<IUserShift> => {
    try {
      // Вызываем API функцию
      const response = await createUserShiftApi(payload);

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

export const getUsersShifts = createAsyncThunk(
  'users-shifts/get',
  async (shiftId: string): Promise<IList<IUserShift>> => {
    try {
      const response = await getUsersShiftsApi(shiftId);

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

export const updateUserShift = createAsyncThunk(
  'users-shifts/update',
  async (payload: IUserShift): Promise<ISuccess> => {
    try {
      // Вызываем API функцию
      const response = await updateUserShiftApi(payload);

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

export const deleteUserShift = createAsyncThunk(
  'users-shifts/delete',
  async (id: string): Promise<ISuccess> => {
    try {
      const response = await deleteUserShiftApi(id);

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
