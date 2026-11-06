import { createSlice } from '@reduxjs/toolkit';

import { INotice } from '../../../utils/api.interfaces';

import {
  createMissingShiftsNotices,
  createPendingShiftsNotices,
  getNoticeById,
  getNotices,
  markNoticeAsRead,
} from './actions';

interface INoticeState {
  notice: INotice | null;
  notices: INotice[] | null;

  isCreateMissingShiftsLoading: boolean;
  createMissingShiftsError: string | null;

  isCreatePendingShiftsLoading: boolean;
  createPendingShiftsError: string | null;

  isGetNoticeByIdLoading: boolean;
  getNoticeByIdError: string | null;

  isGetNoticesLoading: boolean;
  getNoticesError: string | null;

  isMarkNoticeAsReadLoading: boolean;
  markNoticeAsReadError: string | null;
}

const initialState: INoticeState = {
  notice: null,
  notices: null,

  isCreateMissingShiftsLoading: false,
  createMissingShiftsError: null,

  isCreatePendingShiftsLoading: false,
  createPendingShiftsError: null,

  isGetNoticeByIdLoading: false,
  getNoticeByIdError: null,

  isGetNoticesLoading: false,
  getNoticesError: null,

  isMarkNoticeAsReadLoading: false,
  markNoticeAsReadError: null,
};

export const noticeSlice = createSlice({
  name: 'notice',
  initialState,
  reducers: {
    clearNotice: (state) => {
      state.notice = null;
    },
    clearNotices: (state) => {
      state.notices = null;
    },
    clearCreateMissingShiftsError: (state) => {
      state.createMissingShiftsError = null;
    },
    clearCreatePendingShiftsError: (state) => {
      state.createPendingShiftsError = null;
    },
    clearGetNoticeByIdError: (state) => {
      state.getNoticeByIdError = null;
    },
    clearGetNoticesError: (state) => {
      state.getNoticesError = null;
    },
    clearMarkNoticeAsReadError: (state) => {
      state.markNoticeAsReadError = null;
    },
  },
  selectors: {
    selectNotice: (state: INoticeState) => state.notice,
    selectNotices: (state: INoticeState) => state.notices,

    selectIsCreateMissingShiftsLoading: (state: INoticeState) =>
      state.isCreateMissingShiftsLoading,
    selectCreateMissingShiftsError: (state: INoticeState) =>
      state.createMissingShiftsError,

    selectIsCreatePendingShiftsLoading: (state: INoticeState) =>
      state.isCreatePendingShiftsLoading,
    selectCreatePendingShiftsError: (state: INoticeState) =>
      state.createPendingShiftsError,

    selectIsGetNoticeByIdLoading: (state: INoticeState) =>
      state.isGetNoticeByIdLoading,
    selectGetNoticeByIdError: (state: INoticeState) => state.getNoticeByIdError,

    selectIsGetNoticesLoading: (state: INoticeState) =>
      state.isGetNoticesLoading,
    selectGetUnresolvedNoticesError: (state: INoticeState) =>
      state.getNoticesError,

    selectIsMarkNoticeAsReadLoading: (state: INoticeState) =>
      state.isMarkNoticeAsReadLoading,
    selectMarkNoticeAsReadError: (state: INoticeState) =>
      state.markNoticeAsReadError,
  },
  extraReducers: (builder) => {
    builder
      // Обработчики для createMissingShiftsNotices
      .addCase(createMissingShiftsNotices.pending, (state) => {
        state.isCreateMissingShiftsLoading = true;
        state.createMissingShiftsError = null;
      })
      .addCase(createMissingShiftsNotices.fulfilled, (state) => {
        state.isCreateMissingShiftsLoading = false;
        state.createMissingShiftsError = null;
      })
      .addCase(createMissingShiftsNotices.rejected, (state, action) => {
        state.isCreateMissingShiftsLoading = false;
        state.createMissingShiftsError =
          action.error.message ??
          'Ошибка создания уведомлений об отсутствующих сменах';
      })
      // Обработчики для createPendingShiftsNotices
      .addCase(createPendingShiftsNotices.pending, (state) => {
        state.isCreatePendingShiftsLoading = true;
        state.createPendingShiftsError = null;
      })
      .addCase(createPendingShiftsNotices.fulfilled, (state) => {
        state.isCreatePendingShiftsLoading = false;
        state.createPendingShiftsError = null;
      })
      .addCase(createPendingShiftsNotices.rejected, (state, action) => {
        state.isCreatePendingShiftsLoading = false;
        state.createPendingShiftsError =
          action.error.message ??
          'Ошибка создания уведомлений о незаполненных сменах';
      })
      // Обработчики для getNoticeById
      .addCase(getNoticeById.pending, (state) => {
        state.isGetNoticeByIdLoading = true;
        state.getNoticeByIdError = null;
      })
      .addCase(getNoticeById.fulfilled, (state, action) => {
        state.notice = action.payload;
        state.isGetNoticeByIdLoading = false;
        state.getNoticeByIdError = null;
      })
      .addCase(getNoticeById.rejected, (state, action) => {
        state.isGetNoticeByIdLoading = false;
        state.getNoticeByIdError =
          action.error.message ?? 'Ошибка загрузки уведомления';
      })
      // Обработчики для getNotices
      .addCase(getNotices.pending, (state) => {
        state.isGetNoticesLoading = true;
        state.getNoticesError = null;
      })
      .addCase(getNotices.fulfilled, (state, action) => {
        state.notices = action.payload;
        state.isGetNoticesLoading = false;
        state.getNoticesError = null;
      })
      .addCase(getNotices.rejected, (state, action) => {
        state.isGetNoticesLoading = false;
        state.getNoticesError =
          action.error.message ?? 'Ошибка загрузки уведомлений';
      })
      // Обработчики для markNoticeAsRead
      .addCase(markNoticeAsRead.pending, (state) => {
        state.isMarkNoticeAsReadLoading = true;
        state.markNoticeAsReadError = null;
      })
      .addCase(markNoticeAsRead.fulfilled, (state) => {
        state.isMarkNoticeAsReadLoading = false;
        state.markNoticeAsReadError = null;
      })
      .addCase(markNoticeAsRead.rejected, (state, action) => {
        state.isMarkNoticeAsReadLoading = false;
        state.markNoticeAsReadError =
          action.error.message ??
          'Ошибка при отметке уведомления как прочитанное';
      });
  },
});

// Экспорт действий
export const {
  clearNotice,
  clearNotices,
  clearCreateMissingShiftsError,
  clearCreatePendingShiftsError,
  clearGetNoticeByIdError,
  clearGetNoticesError,
  clearMarkNoticeAsReadError,
} = noticeSlice.actions;

// Экспорт селекторов
export const {
  selectNotice,
  selectNotices,
  selectIsCreateMissingShiftsLoading,
  selectCreateMissingShiftsError,
  selectIsCreatePendingShiftsLoading,
  selectCreatePendingShiftsError,
  selectIsGetNoticeByIdLoading,
  selectGetNoticeByIdError,
  selectIsGetNoticesLoading,
  selectGetUnresolvedNoticesError,
  selectIsMarkNoticeAsReadLoading,
  selectMarkNoticeAsReadError,
} = noticeSlice.selectors;
