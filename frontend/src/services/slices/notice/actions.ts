import { createAsyncThunk } from '@reduxjs/toolkit';

import { INotice, ISuccess } from '../../../utils/api.interfaces';

import {
  createMissingShiftsNoticesApi,
  createPendingShiftsNoticesApi,
  getNoticeByIdApi,
  getNoticesApi,
  markNoticeAsReadApi,
} from '../../../utils/api/notice.api';
import { delay } from '../../../utils/utils';

export const createMissingShiftsNotices = createAsyncThunk<ISuccess, void>(
  'notices/createMissingShifts',
  async (): Promise<ISuccess> => {
    try {
      // Используем API
      const response = await createMissingShiftsNoticesApi();

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Что-то пошло не так');
    }
  },
);

export const createPendingShiftsNotices = createAsyncThunk<ISuccess, void>(
  'notices/createPendingShifts',
  async (): Promise<ISuccess> => {
    try {
      // Используем API
      const response = await createPendingShiftsNoticesApi();

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Что-то пошло не так');
    }
  },
);

export const getNotices = createAsyncThunk<INotice[], void>(
  'notices/getNotices',
  async (): Promise<INotice[]> => {
    try {
      const response = await getNoticesApi();
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

export const getNoticeById = createAsyncThunk<INotice, string>(
  'notices/getNoticeById',
  async (id: string): Promise<INotice> => {
    try {
      const response = await getNoticeByIdApi(id);
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

export const markNoticeAsRead = createAsyncThunk<ISuccess, string>(
  'notices/markAsRead',
  async (id: string): Promise<ISuccess> => {
    try {
      const response = await markNoticeAsReadApi(id);
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

// Добавляем задержку кода
// await delay(1000);
