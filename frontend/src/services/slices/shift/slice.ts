import { createSlice } from '@reduxjs/toolkit';
import { createShift, getCurrentShifts } from './actions';

interface IShiftState {
  isCreateShiftLoading: boolean;
  createShiftError: string | null;

  currentShifts: any[];
  isCurrentShiftsLoading: boolean;
  currentShiftsError: string | null;
}

const initialState: IShiftState = {
  isCreateShiftLoading: false,
  createShiftError: null,

  currentShifts: [],
  isCurrentShiftsLoading: false,
  currentShiftsError: null,
};

export const shiftSlice = createSlice({
  name: 'shift',
  initialState,
  reducers: {
    clearCreateShiftError: (state) => {
      state.createShiftError = null;
    },
    clearCurrentShiftsError: (state) => {
      state.currentShiftsError = null;
    },
    clearCurrentShiftsData: (state) => {
      state.currentShifts = [];
    },
  },
  selectors: {
    selectIsCreateShiftLoading: (state: IShiftState) =>
      state.isCreateShiftLoading,
    selectCreateShiftError: (state: IShiftState) => state.createShiftError,

    selectIsCurrentShiftsLoading: (state: IShiftState) =>
      state.isCurrentShiftsLoading,
    selectCurrentShiftsError: (state: IShiftState) => state.currentShiftsError,
    selectCurrentShifts: (state: IShiftState) => state.currentShifts,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для createShift (pending)
      .addCase(createShift.pending, (state) => {
        state.isCreateShiftLoading = true;
        state.createShiftError = null;
      })
      // Обработчик для createShift (fulfilled)
      .addCase(createShift.fulfilled, (state) => {
        state.isCreateShiftLoading = false;
        state.createShiftError = null;
      })
      // Обработчик для createShift (rejected)
      .addCase(createShift.rejected, (state, action) => {
        state.isCreateShiftLoading = false;
        state.createShiftError =
          action.error.message ?? 'Ошибка создания смены';
      });

    // Обработчики getCurrentShifts
    builder
      .addCase(getCurrentShifts.pending, (state) => {
        state.isCurrentShiftsLoading = true;
        state.currentShiftsError = null;
        // Если хочешь сбрасывать данные при каждом новом запросе — раскомментируй:
        state.currentShifts = [];
      })
      .addCase(getCurrentShifts.fulfilled, (state, action) => {
        state.isCurrentShiftsLoading = false;
        state.currentShiftsError = null;
        state.currentShifts = action.payload;
      })
      .addCase(getCurrentShifts.rejected, (state, action) => {
        state.isCurrentShiftsLoading = false;
        state.currentShiftsError =
          action.error.message ?? 'Не удалось загрузить смены';
        // Данные не очищаем: можно показать старые, пока грузятся новые
      });
  },
});

// Экспорт действий
export const {
  clearCreateShiftError,
  clearCurrentShiftsError,
  clearCurrentShiftsData,
} = shiftSlice.actions;

// Экспорт селекторов
export const {
  selectIsCreateShiftLoading,
  selectCreateShiftError,
  selectIsCurrentShiftsLoading,
  selectCurrentShiftsError,
  selectCurrentShifts,
} = shiftSlice.selectors;
