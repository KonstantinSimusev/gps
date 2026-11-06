import { createSlice } from '@reduxjs/toolkit';

import { IShift } from '../../../utils/api.interfaces';

import { getShiftById, getShifts, getShiftsByDate } from './actions';

interface IShiftState {
  shift: IShift | null;
  shifts: IShift[] | null;
  searchShifts: IShift[] | null;

  isShiftLoading: boolean;
  shiftError: string | null;

  isGetShiftsLoading: boolean;
  getShiftsError: string | null;

  isSearchShiftsLoading: boolean;
  searchShiftsError: string | null;
}

const initialState: IShiftState = {
  shift: null,
  shifts: null,
  searchShifts: null,

  isShiftLoading: false,
  shiftError: null,

  isGetShiftsLoading: false,
  getShiftsError: null,

  isSearchShiftsLoading: false,
  searchShiftsError: null,
};

export const shiftSlice = createSlice({
  name: 'shift',
  initialState,
  reducers: {
    clearShift: (state) => {
      state.shift = null;
    },
    clearShifts: (state) => {
      state.shifts = null;
    },
    clearSearchShifts: (state) => {
      state.searchShifts = null;
    },
    clearShiftError: (state) => {
      state.shiftError = null;
    },
    clearGetShiftsError: (state) => {
      state.getShiftsError = null;
    },
    clearSearchShiftsError: (state) => {
      state.searchShiftsError = null;
    },
  },
  selectors: {
    selectShift: (state: IShiftState) => state.shift,
    selectShifts: (state: IShiftState) => state.shifts,
    selectSearchShifts: (state: IShiftState) => state.searchShifts,

    selectIsShiftLoading: (state: IShiftState) => state.isShiftLoading,
    selectShiftError: (state: IShiftState) => state.shiftError,

    selectIsGetShiftsLoading: (state: IShiftState) => state.isGetShiftsLoading,
    selectGetShiftsError: (state: IShiftState) => state.getShiftsError,

    selectIsSearchShiftsLoading: (state: IShiftState) =>
      state.isSearchShiftsLoading,
    selectSearchShiftsError: (state: IShiftState) => state.searchShiftsError,
  },
  extraReducers: (builder) => {
    builder
      // Обработчики для getShiftById
      .addCase(getShiftById.pending, (state) => {
        state.isShiftLoading = true;
        state.shiftError = null;
      })
      .addCase(getShiftById.fulfilled, (state, action) => {
        state.isShiftLoading = false;
        state.shiftError = null;
        state.shift = action.payload;
      })
      .addCase(getShiftById.rejected, (state, action) => {
        state.isShiftLoading = false;
        state.shiftError = action.error.message ?? 'Не удалось загрузить смену';
      })

      // Обработчики для getShifts
      .addCase(getShifts.pending, (state) => {
        state.isGetShiftsLoading = true;
        state.getShiftsError = null;
      })
      .addCase(getShifts.fulfilled, (state, action) => {
        state.isGetShiftsLoading = false;
        state.getShiftsError = null;
        state.shifts = action.payload;
      })
      .addCase(getShifts.rejected, (state, action) => {
        state.isGetShiftsLoading = false;
        state.getShiftsError =
          action.error.message ?? 'Не удалось загрузить смены';
      })

      // Обработчики для searchShifts
      .addCase(getShiftsByDate.pending, (state) => {
        state.isSearchShiftsLoading = true;
        state.searchShiftsError = null;
      })
      .addCase(getShiftsByDate.fulfilled, (state, action) => {
        state.isSearchShiftsLoading = false;
        state.searchShiftsError = null;
        state.searchShifts = action.payload; // пишем в searchShifts
      })
      .addCase(getShiftsByDate.rejected, (state, action) => {
        state.isSearchShiftsLoading = false;
        state.searchShiftsError =
          action.error.message ?? 'Не удалось загрузить смены по дате';
      });
  },
});

// Экспорт действий
export const {
  clearShift,
  clearShifts,
  clearSearchShifts,
  clearShiftError,
  clearGetShiftsError,
  clearSearchShiftsError,
} = shiftSlice.actions;

// Экспорт селекторов
export const {
  selectShift,
  selectShifts,
  selectSearchShifts,
  selectIsShiftLoading,
  selectShiftError,
  selectIsGetShiftsLoading,
  selectGetShiftsError,
  selectIsSearchShiftsLoading,
  selectSearchShiftsError,
} = shiftSlice.selectors;
