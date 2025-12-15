import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  createShift,
  getActiveShift,
  getFinishedShift,
  getLastShiftsTeams,
  getLastTeamShift,
} from './actions';

import type { IList, IShift } from '../../../utils/api.interface';

interface IShiftState {
  lastTeamShift: IShift | null;
  activeShift: IShift | null;
  finishedShift: IShift | null;
  lastShiftsTeams: IShift[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IShiftState = {
  lastTeamShift: null,
  activeShift: null,
  finishedShift: null,
  lastShiftsTeams: [],
  isLoading: false,
  error: null,
};

export const shiftSlice = createSlice({
  name: 'shift',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetShift: (state) => {
      state.lastTeamShift = null;
      state.error = null;
    },
  },
  selectors: {
    selectCurrentShift: (state: IShiftState) => state.lastTeamShift,
    selectActiveShift: (state: IShiftState) => state.activeShift,
    selectFinishedShift: (state: IShiftState) => state.finishedShift,
    selectCurrentShiftId: (state: IShiftState) =>
      state.lastTeamShift ? state.lastTeamShift.id : null,
    selectLastShiftsTeams: (state: IShiftState) => state.lastShiftsTeams,
    selectIsLoadingShift: (state: IShiftState) => state.isLoading,
    selectError: (state: IShiftState) => state.error,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для createShift
      .addCase(createShift.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createShift.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createShift.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка создания смены';
      })
      // Обработчик для getActiveShift
      .addCase(getActiveShift.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getActiveShift.fulfilled,
        (state, action: PayloadAction<IShift>) => {
          state.activeShift = action.payload;
          state.isLoading = false;
          state.error = null;
        },
      )
      .addCase(getActiveShift.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка получения смен';
      })
      // Обработчик для getFinishedShift
      .addCase(getFinishedShift.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getFinishedShift.fulfilled,
        (state, action: PayloadAction<IShift>) => {
          state.finishedShift = action.payload;
          state.isLoading = false;
          state.error = null;
        },
      )
      .addCase(getFinishedShift.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка получения смен';
      })
      // Обработчик для getLastTeamShift
      .addCase(getLastTeamShift.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getLastTeamShift.fulfilled,
        (state, action: PayloadAction<IShift>) => {
          state.lastTeamShift = action.payload;
          state.isLoading = false;
          state.error = null;
        },
      )
      .addCase(getLastTeamShift.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка получения смены';
      })
      // Обработчик для getLastShiftsTeams
      .addCase(getLastShiftsTeams.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getLastShiftsTeams.fulfilled,
        (state, action: PayloadAction<IList<IShift>>) => {
          state.lastShiftsTeams = action.payload.items;
          state.isLoading = false;
          state.error = null;
        },
      )
      .addCase(getLastShiftsTeams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка получения смен';
      });
  },
});

export const { resetShift, clearError } = shiftSlice.actions;
export const {
  selectCurrentShift,
  selectActiveShift,
  selectFinishedShift,
  selectCurrentShiftId,
  selectLastShiftsTeams,
  selectIsLoadingShift,
  selectError,
} = shiftSlice.selectors;
