import { createAsyncThunk } from '@reduxjs/toolkit';

import { delay } from '../../../utils/utils';

import { IShift } from '../../../utils/api.interface';

import {
  // createMissingShiftsApi,
  createShiftsApi,
  getShiftByIdApi,
  getShiftsApi,
  getShiftsByDateApi,
  // getUncheckedShiftsApi,
  setCheckedByShiftIdApi,
} from '../../../utils/api/shift.api';

export const createShifts = createAsyncThunk<IShift[], void>(
  'shifts/create',
  async (): Promise<IShift[]> => {
    try {
      // Вызываем API функцию
      const response = await createShiftsApi();

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

// export const createMissingShifts = createAsyncThunk<ISuccess, void>(
//   'shifts/createMissingShifts',
//   async (): Promise<ISuccess> => {
//     try {
//       // Вызываем API функцию
//       const response = await createMissingShiftsApi();

//       return response;
//     } catch (error) {
//       if (error instanceof Error) {
//         throw error;
//       }

//       throw new Error('Что-то пошло не так');
//     }
//   },
// );

export const getShifts = createAsyncThunk<IShift[], void>(
  'shifts/get',
  async (): Promise<IShift[]> => {
    try {
      // Вызываем API функцию
      const response = await getShiftsApi();

      // Добавляем задержку кода
      // await delay();

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error; // передаём точное сообщение от бэкенда
      }

      throw new Error('Что-то пошло не так');
    }
  },
);

// export const getUncheckedShifts = createAsyncThunk<IShift[], void>(
//   'shifts/getUncheckedShifts',
//   async (): Promise<IShift[]> => {
//     try {
//       // Вызываем API функцию
//       const response = await getUncheckedShiftsApi();

//       // Добавляем задержку кода
//       // await delay();

//       return response;
//     } catch (error) {
//       // Добавляем задержку кода
//       // await delay();

//       if (error instanceof Error) {
//         throw error;
//       }

//       throw new Error('Что-то пошло не так');
//     }
//   },
// );

export const getShiftById = createAsyncThunk<IShift, { id: string }>(
  'shifts/getById',
  async ({ id }) => {
    try {
      const response = await getShiftByIdApi(id);

      // await delay();

      return response;
    } catch (error) {
      // await delay();

      if (error instanceof Error) {
        throw error; // передаём точное сообщение от бэкенда
      }

      throw new Error('Что-то пошло не так');
    }
  },
);

export const getShiftsByDate = createAsyncThunk<
  IShift[],
  { shiftDate: string }
>('shifts/getByDate', async ({ shiftDate }): Promise<IShift[]> => {
  try {
    const response = await getShiftsByDateApi(shiftDate);

    // Добавляем задержку кода
    await delay();

    return response;
  } catch (error) {
    // Добавляем задержку кода
    await delay();

    if (error instanceof Error) {
      throw error; // передаём точное сообщение от бэкенда
    }

    throw new Error('Что-то пошло не так при получении смен по дате');
  }
});

export const setCheckedByShiftId = createAsyncThunk(
  'shifts/check',
  async (shiftId: string, { rejectWithValue }) => {
    const res = await setCheckedByShiftIdApi(shiftId);

    if (typeof res === 'string') {
      return rejectWithValue(res); // Сюда попадёт errorData.message
    }

    return res; // Сюда попадёт ISuccess
  },
);
