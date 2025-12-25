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
  isLoadingActiveShift: boolean;
  isLoadingFinishedShift: boolean;
  isLoadingShift: boolean;
  error: string | null;
}

const initialState: IShiftState = {
  lastTeamShift: null,
  activeShift: null,
  finishedShift: null,
  lastShiftsTeams: [],
  isLoadingActiveShift: false,
  isLoadingFinishedShift: false,
  isLoadingShift: false,
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
    selectLastShift: (state: IShiftState) => state.lastTeamShift,
    selectActiveShift: (state: IShiftState) => state.activeShift,
    selectFinishedShift: (state: IShiftState) => state.finishedShift,
    selectLastShiftsTeams: (state: IShiftState) => state.lastShiftsTeams,
    selectIsLoadingLastShift: (state: IShiftState) => state.isLoadingShift,
    selectError: (state: IShiftState) => state.error,
    selectIsLoadingActiveShift: (state: IShiftState) =>
      state.isLoadingActiveShift,
    selectIsLoadingFinishedShift: (state: IShiftState) =>
      state.isLoadingFinishedShift,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для createShift
      .addCase(createShift.pending, (state) => {
        state.isLoadingShift = true;
        state.error = null;
      })
      .addCase(createShift.fulfilled, (state) => {
        state.isLoadingShift = false;
        state.error = null;
      })
      .addCase(createShift.rejected, (state, action) => {
        state.isLoadingShift = false;
        state.error = action.error.message ?? 'Ошибка создания смены';
      })
      // Обработчик для getActiveShift
      .addCase(getActiveShift.pending, (state) => {
        state.isLoadingActiveShift = true;
        state.error = null;
      })
      .addCase(
        getActiveShift.fulfilled,
        (state, action: PayloadAction<IShift>) => {
          state.activeShift = action.payload;
          state.isLoadingActiveShift = false;
          state.error = null;
        },
      )
      .addCase(getActiveShift.rejected, (state, action) => {
        state.isLoadingActiveShift = false;
        state.error = action.error.message ?? 'Ошибка получения смен';
      })
      // Обработчик для getFinishedShift
      .addCase(getFinishedShift.pending, (state) => {
        state.isLoadingFinishedShift = true;
        state.error = null;
      })
      .addCase(
        getFinishedShift.fulfilled,
        (state, action: PayloadAction<IShift>) => {
          state.finishedShift = action.payload;
          state.isLoadingFinishedShift = false;
          state.error = null;
        },
      )
      .addCase(getFinishedShift.rejected, (state, action) => {
        state.isLoadingFinishedShift = false;
        state.error = action.error.message ?? 'Ошибка получения смен';
      })
      // Обработчик для getLastTeamShift
      .addCase(getLastTeamShift.pending, (state) => {
        state.isLoadingShift = true;
        state.error = null;
      })
      .addCase(
        getLastTeamShift.fulfilled,
        (state, action: PayloadAction<IShift>) => {
          state.lastTeamShift = action.payload;
          state.isLoadingShift = false;
          state.error = null;
        },
      )
      .addCase(getLastTeamShift.rejected, (state, action) => {
        state.isLoadingShift = false;
        state.error = action.error.message ?? 'Ошибка получения смены';
      })
      // Обработчик для getLastShiftsTeams
      .addCase(getLastShiftsTeams.pending, (state) => {
        state.isLoadingShift = true;
        state.error = null;
      })
      .addCase(
        getLastShiftsTeams.fulfilled,
        (state, action: PayloadAction<IList<IShift>>) => {
          state.lastShiftsTeams = action.payload.items;
          state.isLoadingShift = false;
          state.error = null;
        },
      )
      .addCase(getLastShiftsTeams.rejected, (state, action) => {
        state.isLoadingShift = false;
        state.error = action.error.message ?? 'Ошибка получения смен';
      });
  },
});

export const { resetShift, clearError } = shiftSlice.actions;
export const {
  selectLastShift,
  selectActiveShift,
  selectFinishedShift,
  selectLastShiftsTeams,
  selectIsLoadingActiveShift,
  selectIsLoadingFinishedShift,
  selectIsLoadingLastShift,
  selectError,
} = shiftSlice.selectors;
