import { createSlice } from '@reduxjs/toolkit';
import { createShift } from './actions';

interface IShiftState {
  isCreateShiftLoading: boolean;
  createShiftError: string | null;
}

const initialState: IShiftState = {
  isCreateShiftLoading: false,
  createShiftError: null,
};

export const shiftSlice = createSlice({
  name: 'shift',
  initialState,
  reducers: {
    clearCreateShiftError: (state) => {
      state.createShiftError = null;
    },
  },
  selectors: {
    selectIsCreateShiftLoading: (state: IShiftState) =>
      state.isCreateShiftLoading,
    selectCreateShiftError: (state: IShiftState) => state.createShiftError,
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
  },
});

// Экспорт действий
export const { clearCreateShiftError } = shiftSlice.actions;

// Экспорт селекторов
export const { selectIsCreateShiftLoading, selectCreateShiftError } =
  shiftSlice.selectors;
