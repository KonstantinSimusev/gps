import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getEmployeeInfo } from './actions';
import { IEmployeeInfo } from '../../../utils/api.interface';

interface IEmployeeState {
  employee: IEmployeeInfo | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IEmployeeState = {
  employee: null,
  isLoading: false,
  error: null,
};

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    selectEmployee: (state: IEmployeeState) => state.employee,
    selectIsEmployeeLoading: (state: IEmployeeState) => state.isLoading,
    selectEmployeeError: (state: IEmployeeState) => state.error,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для getEmployeeInfo
      .addCase(getEmployeeInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getEmployeeInfo.fulfilled,
        (state, action: PayloadAction<IEmployeeInfo>) => {
          state.employee = action.payload;
          state.isLoading = false;
          state.error = null;
        },
      )
      .addCase(getEmployeeInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка получения данных';
      });
  },
});

export const { clearError } = employeeSlice.actions;

export const { selectEmployee, selectIsEmployeeLoading, selectEmployeeError } =
  employeeSlice.selectors;
