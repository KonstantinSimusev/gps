import { createSlice } from '@reduxjs/toolkit';

import { IShift } from '../../../utils/api.interface';
import {
  // createMissingShifts,
  createShifts,
  getShiftById,
  getShifts,
  getShiftsByDate,
  // getUncheckedShifts,
  setCheckedByShiftId,
} from './actions';

interface IShiftState {
  shift: IShift | null;
  shifts: IShift[] | null;
  searchShifts: IShift[] | null;
  // uncheckedShifts: IShift[] | null;

  isShiftLoading: boolean;
  shiftError: string | null;

  isCreateShiftsLoading: boolean;
  createShiftsError: string | null;

  // isCreateMissingShiftsLoading: boolean;
  // createMissingShiftsError: string | null;

  isGetShiftsLoading: boolean;
  getShiftsError: string | null;

  isSearchShiftsLoading: boolean;
  searchShiftsError: string | null;

  // isGetUncheckedShiftsLoading: boolean;
  // getUncheckedShiftsError: string | null;

  isCheckingShiftLoading: boolean;
  checkingShiftError: string | null;
}

const initialState: IShiftState = {
  shift: null,
  shifts: null,
  searchShifts: null,
  // uncheckedShifts: null,

  isShiftLoading: false,
  shiftError: null,

  isCreateShiftsLoading: false,
  createShiftsError: null,

  // isCreateMissingShiftsLoading: false,
  // createMissingShiftsError: null,

  isGetShiftsLoading: false,
  getShiftsError: null,

  isSearchShiftsLoading: false,
  searchShiftsError: null,

  // isGetUncheckedShiftsLoading: false,
  // getUncheckedShiftsError: null,

  isCheckingShiftLoading: false,
  checkingShiftError: null,
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
    clearCreateShiftsError: (state) => {
      state.createShiftsError = null;
    },
    // clearUncheckedShifts: (state) => {
    //   state.uncheckedShifts = null;
    // },
    // clearCreateMissingShiftsError: (state) => {
    //   state.createMissingShiftsError = null;
    // },
    clearGetShiftsError: (state) => {
      state.getShiftsError = null;
    },
    clearSearchShiftsError: (state) => {
      state.searchShiftsError = null;
    },
    // clearGetUncheckedShiftsError: (state) => {
    //   state.getUncheckedShiftsError = null;
    // },
    clearCheckingShiftError: (state) => {
      state.checkingShiftError = null;
    },
  },
  selectors: {
    selectShift: (state: IShiftState) => state.shift,
    selectShifts: (state: IShiftState) => state.shifts,
    selectSearchShifts: (state: IShiftState) => state.searchShifts,
    // selectUncheckedShifts: (state: IShiftState) => state.uncheckedShifts,

    selectIsShiftLoading: (state: IShiftState) => state.isShiftLoading,
    selectShiftError: (state: IShiftState) => state.shiftError,

    selectIsCreateShiftsLoading: (state: IShiftState) =>
      state.isCreateShiftsLoading,
    selectCreateShiftsError: (state: IShiftState) => state.createShiftsError,

    // selectIsCreateMissingShiftsLoading: (state: IShiftState) =>
    //   state.isCreateMissingShiftsLoading,
    // selectCreateMissingShiftsError: (state: IShiftState) =>
    //   state.createMissingShiftsError,

    selectIsGetShiftsLoading: (state: IShiftState) => state.isGetShiftsLoading,
    selectGetShiftsError: (state: IShiftState) => state.getShiftsError,

    selectIsSearchShiftsLoading: (state: IShiftState) =>
      state.isSearchShiftsLoading,
    selectSearchShiftsError: (state: IShiftState) => state.searchShiftsError,

    // selectIsGetUncheckedShiftsLoading: (state: IShiftState) =>
    //   state.isGetUncheckedShiftsLoading,
    // selectGetUncheckedShiftsError: (state: IShiftState) =>
    //   state.getUncheckedShiftsError,

    selectIsCheckingShiftLoading: (state: IShiftState) =>
      state.isCheckingShiftLoading,
    selectCheckingShiftError: (state: IShiftState) => state.checkingShiftError,
  },
  extraReducers: (builder) => {
    builder
      // Обработчики для createShifts
      .addCase(createShifts.pending, (state) => {
        state.isCreateShiftsLoading = true;
        state.createShiftsError = null;
      })
      .addCase(createShifts.fulfilled, (state) => {
        state.isCreateShiftsLoading = false;
        state.createShiftsError = null;
      })
      .addCase(createShifts.rejected, (state, action) => {
        state.isCreateShiftsLoading = false;
        state.createShiftsError =
          action.error.message ?? 'Ошибка создания смены';
      })

      // Обработчики для createMissingShifts
      // .addCase(createMissingShifts.pending, (state) => {
      //   state.isCreateMissingShiftsLoading = true;
      //   state.createMissingShiftsError = null;
      // })
      // .addCase(createMissingShifts.fulfilled, (state) => {
      //   state.isCreateMissingShiftsLoading = false;
      //   state.createMissingShiftsError = null;
      // })
      // .addCase(createMissingShifts.rejected, (state, action) => {
      //   state.isCreateMissingShiftsLoading = false;
      //   state.createMissingShiftsError =
      //     action.error.message ?? 'Ошибка создания смены';
      // })

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
      })

      // Обработчики для getUncheckedShifts
      // .addCase(getUncheckedShifts.pending, (state) => {
      //   state.isGetUncheckedShiftsLoading = true;
      //   state.getUncheckedShiftsError = null;
      // })
      // .addCase(getUncheckedShifts.fulfilled, (state, action) => {
      //   state.isGetUncheckedShiftsLoading = false;
      //   state.getUncheckedShiftsError = null;
      //   state.uncheckedShifts = action.payload;
      // })
      // .addCase(getUncheckedShifts.rejected, (state, action) => {
      //   state.isGetUncheckedShiftsLoading = false;
      //   state.getUncheckedShiftsError =
      //     action.error.message ?? 'Не удалось загрузить непроверенные смены';
      // })

      // Обработчики для setCheckedByShiftId
      .addCase(setCheckedByShiftId.pending, (state) => {
        state.isCheckingShiftLoading = true;
        state.checkingShiftError = null;
      })
      .addCase(setCheckedByShiftId.fulfilled, (state) => {
        state.isCheckingShiftLoading = false;
        state.checkingShiftError = null;
      })
      .addCase(setCheckedByShiftId.rejected, (state, action) => {
        state.isCheckingShiftLoading = false;
        state.checkingShiftError = action.payload as string;
      });
  },
});

// Экспорт действий
export const {
  clearShift,
  clearShifts,
  clearSearchShifts,
  // clearUncheckedShifts,
  clearShiftError,
  clearCreateShiftsError,
  // clearCreateMissingShiftsError,
  clearGetShiftsError,
  clearSearchShiftsError,
  // clearGetUncheckedShiftsError,
  clearCheckingShiftError,
} = shiftSlice.actions;

// Экспорт селекторов
export const {
  selectShift,
  selectShifts,
  selectSearchShifts,
  // selectUncheckedShifts,
  selectIsShiftLoading,
  selectShiftError,
  selectIsCreateShiftsLoading,
  selectCreateShiftsError,
  // selectIsCreateMissingShiftsLoading,
  // selectCreateMissingShiftsError,
  selectIsGetShiftsLoading,
  selectGetShiftsError,
  selectIsSearchShiftsLoading,
  selectSearchShiftsError,
  // selectIsGetUncheckedShiftsLoading,
  // selectGetUncheckedShiftsError,
  selectIsCheckingShiftLoading,
  selectCheckingShiftError,
} = shiftSlice.selectors;
