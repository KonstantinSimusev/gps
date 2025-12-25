import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  createShiftApi,
  getActiveShiftApi,
  getFinishedShiftApi,
  getLastShiftsTeamsApi,
  getLastTeamShiftApi,
} from '../../../utils/api/shift.api';

import { IShift, ISuccess } from '../../../utils/api.interface';

import { delay } from '../../../utils/utils';

export const createShift = createAsyncThunk(
  'shift/create',
  async (data: IShift): Promise<ISuccess> => {
    try {
      // Вызываем API функцию
      const response = await createShiftApi(data);

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

export const getActiveShift = createAsyncThunk('shift/active', async () => {
  try {
    const response = await getActiveShiftApi();

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
});

export const getFinishedShift = createAsyncThunk('shift/finished', async () => {
  try {
    const response = await getFinishedShiftApi();

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
});

export const getLastTeamShift = createAsyncThunk(
  'shift/last-team-shift',
  async () => {
    try {
      const response = await getLastTeamShiftApi();

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

export const getLastShiftsTeams = createAsyncThunk(
  'shift/last-shifts-teams',
  async () => {
    try {
      const response = await getLastShiftsTeamsApi();

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
