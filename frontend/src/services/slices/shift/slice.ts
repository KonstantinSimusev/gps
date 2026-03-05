import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  createShift,
  getLastShift,
  // getActiveShift,
  // getFinishedShift,
  // getLastShiftsTeams,
  // getLastTeamShift,
} from './actions';

import type { IShift } from '../../../utils/api.interface';

interface IShiftState {
  createdShift: IShift | null;
  isLoadingCreatedShift: boolean;
  createdShiftError: string | null;

  lastShift: IShift | null;
  isLoadingLastShift: boolean;
  lastShiftError: string | null;

  // lastTeamShift: IShift | null;
  // isLoadingLastTeamShift: boolean;

  // activeShift: IShift | null;
  // finishedShift: IShift | null;
  // lastShiftsTeams: IShift[];
  // isLoadingActiveShift: boolean;
  // isLoadingFinishedShift: boolean;
  // isLoadingShift: boolean;

  // globalError: string | null;
}

const initialState: IShiftState = {
  createdShift: null,
  isLoadingCreatedShift: false,
  createdShiftError: null,

  lastShift: null,
  isLoadingLastShift: false,
  lastShiftError: null,

  // lastTeamShift: null,
  // isLoadingLastTeamShift: false,

  // activeShift: null,
  // finishedShift: null,
  // lastShiftsTeams: [],
  // isLoadingActiveShift: false,
  // isLoadingFinishedShift: false,
  // isLoadingShift: false,

  // globalError: null,
};

export const shiftSlice = createSlice({
  name: 'shift',
  initialState,
  reducers: {
    clearError: (state) => {
      state.createdShiftError = null;
      state.lastShiftError = null;
    },
    resetShift: (state) => {
      state.lastShift = null;
    },
  },
  selectors: {
    selectCreatedShift: (state: IShiftState) => state.createdShift,
    selectIsLoadingCreatedShift: (state: IShiftState) =>
      state.isLoadingCreatedShift,
    selectCreatedShiftError: (state: IShiftState) => state.createdShiftError,

    selectLastShift: (state: IShiftState) => state.lastShift,
    selectIsLoadingLastShift: (state: IShiftState) => state.isLoadingLastShift,
    selectLastShiftError: (state: IShiftState) => state.lastShiftError,

    // selectLastTeamShift: (state: IShiftState) => state.lastTeamShift,
    // selectIsLoadingLastTeamShift: (state: IShiftState) =>
    //   state.isLoadingLastTeamShift,

    // selectActiveShift: (state: IShiftState) => state.activeShift,
    // selectIsLoadingActiveShift: (state: IShiftState) =>
    //   state.isLoadingActiveShift,

    // selectFinishedShift: (state: IShiftState) => state.finishedShift,
    // selectIsLoadingFinishedShift: (state: IShiftState) =>
    //   state.isLoadingFinishedShift,

    // selectLastShiftsTeams: (state: IShiftState) => state.lastShiftsTeams,
    // selectError: (state: IShiftState) => state.globalError,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для createShift
      .addCase(createShift.pending, (state) => {
        state.isLoadingCreatedShift = true;
        state.createdShiftError = null;
      })
      .addCase(
        createShift.fulfilled,
        (state, action: PayloadAction<IShift>) => {
          state.createdShift = action.payload;
          state.isLoadingCreatedShift = false;
          state.createdShiftError = null;
        },
      )
      .addCase(createShift.rejected, (state, action) => {
        state.isLoadingCreatedShift = false;
        state.createdShiftError =
          action.error.message ?? 'Ошибка создания смены';
      })
      // Обработчик для getLastShift
      .addCase(getLastShift.pending, (state) => {
        state.isLoadingLastShift = true;
        state.lastShiftError = null;
      })
      .addCase(
        getLastShift.fulfilled,
        (state, action: PayloadAction<IShift>) => {
          state.lastShift = action.payload;
          state.isLoadingLastShift = false;
          state.lastShiftError = null;
        },
      )
      .addCase(getLastShift.rejected, (state, action) => {
        state.isLoadingLastShift = false;
        state.lastShiftError = action.error.message ?? 'Ошибка получения смены';
      });
    // // Обработчик для getActiveShift
    // .addCase(getActiveShift.pending, (state) => {
    //   state.isLoadingActiveShift = true;
    //   state.error = null;
    // })
    // .addCase(
    //   getActiveShift.fulfilled,
    //   (state, action: PayloadAction<IShift>) => {
    //     state.activeShift = action.payload;
    //     state.isLoadingActiveShift = false;
    //     state.error = null;
    //   },
    // )
    // .addCase(getActiveShift.rejected, (state, action) => {
    //   state.isLoadingActiveShift = false;
    //   state.error = action.error.message ?? 'Ошибка получения смен';
    // })
    // // Обработчик для getFinishedShift
    // .addCase(getFinishedShift.pending, (state) => {
    //   state.isLoadingFinishedShift = true;
    //   state.error = null;
    // })
    // .addCase(
    //   getFinishedShift.fulfilled,
    //   (state, action: PayloadAction<IShift>) => {
    //     state.finishedShift = action.payload;
    //     state.isLoadingFinishedShift = false;
    //     state.error = null;
    //   },
    // )
    // .addCase(getFinishedShift.rejected, (state, action) => {
    //   state.isLoadingFinishedShift = false;
    //   state.error = action.error.message ?? 'Ошибка получения смен';
    // })
    // // Обработчик для getLastTeamShift
    // .addCase(getLastTeamShift.pending, (state) => {
    //   state.isLoadingShift = true;
    //   state.error = null;
    // })
    // .addCase(
    //   getLastTeamShift.fulfilled,
    //   (state, action: PayloadAction<IShift>) => {
    //     state.lastTeamShift = action.payload;
    //     state.isLoadingShift = false;
    //     state.error = null;
    //   },
    // )
    // .addCase(getLastTeamShift.rejected, (state, action) => {
    //   state.isLoadingShift = false;
    //   state.error = action.error.message ?? 'Ошибка получения смены';
    // })
    // // Обработчик для getLastShiftsTeams
    // .addCase(getLastShiftsTeams.pending, (state) => {
    //   state.isLoadingShift = true;
    //   state.error = null;
    // })
    // .addCase(
    //   getLastShiftsTeams.fulfilled,
    //   (state, action: PayloadAction<IList<IShift>>) => {
    //     state.lastShiftsTeams = action.payload.items;
    //     state.isLoadingShift = false;
    //     state.error = null;
    //   },
    // )
    // .addCase(getLastShiftsTeams.rejected, (state, action) => {
    //   state.isLoadingShift = false;
    //   state.error = action.error.message ?? 'Ошибка получения смен';
    // });
  },
});

export const { resetShift, clearError } = shiftSlice.actions;
export const {
  selectCreatedShift,
  selectIsLoadingCreatedShift,
  selectCreatedShiftError,

  selectLastShift,
  selectIsLoadingLastShift,
  selectLastShiftError,

  // selectLastTeamShift,
  // selectIsLoadingLastTeamShift,

  // selectActiveShift,
  // selectFinishedShift,
  // selectLastShiftsTeams,
  // selectIsLoadingActiveShift,
  // selectIsLoadingFinishedShift,
  // selectError,
} = shiftSlice.selectors;
