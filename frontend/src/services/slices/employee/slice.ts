import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { createEmployee, searchEmployee } from './actions';
import { IAccountInfo, IEmployeeInfo } from '../../../utils/api.interface';

interface IEmployeeState {
  employeeInfo: IEmployeeInfo | null;
  isSearchEmployeeLoading: boolean;
  searchEmployeeError: string | null;

  accountInfo: IAccountInfo | null;
  isCreateEmployeeLoading: boolean;
  createEmployeeError: string | null;
}

const initialState: IEmployeeState = {
  employeeInfo: null,
  isSearchEmployeeLoading: false,
  searchEmployeeError: null,

  accountInfo: null,
  isCreateEmployeeLoading: false,
  createEmployeeError: null,
};

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearSearchEmployeeError: (state) => {
      state.searchEmployeeError = null;
    },
    clearCreateEmployeeError: (state) => {
      state.createEmployeeError = null;
    },
  },
  selectors: {
    selectSearсhEmployee: (state: IEmployeeState) => state.employeeInfo,
    selectIsSearchEmployeeLoading: (state: IEmployeeState) =>
      state.isSearchEmployeeLoading,
    selectSearchEmployeeError: (state: IEmployeeState) =>
      state.searchEmployeeError,

    selectCreateEmployee: (state: IEmployeeState) => state.accountInfo,
    selectIsCreateEmployeeLoading: (state: IEmployeeState) =>
      state.isCreateEmployeeLoading,
    selectCreateEmployeeError: (state: IEmployeeState) =>
      state.createEmployeeError,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для searchEmployee
      .addCase(searchEmployee.pending, (state) => {
        state.isSearchEmployeeLoading = true;
        state.searchEmployeeError = null;
      })
      .addCase(
        searchEmployee.fulfilled,
        (state, action: PayloadAction<IEmployeeInfo>) => {
          state.employeeInfo = action.payload;
          state.isSearchEmployeeLoading = false;
          state.searchEmployeeError = null;
        },
      )
      .addCase(searchEmployee.rejected, (state, action) => {
        state.isSearchEmployeeLoading = false;
        state.searchEmployeeError =
          action.error.message ?? 'Ошибка получения данных';
      })
      // Обработчик для createEmployee
      .addCase(createEmployee.pending, (state) => {
        state.isCreateEmployeeLoading = true;
        state.createEmployeeError = null;
      })
      .addCase(
        createEmployee.fulfilled,
        (state, action: PayloadAction<IAccountInfo>) => {
          state.accountInfo = action.payload;
          state.isCreateEmployeeLoading = false;
          state.createEmployeeError = null;
        },
      )
      .addCase(createEmployee.rejected, (state, action) => {
        state.isCreateEmployeeLoading = false;
        state.createEmployeeError =
          action.error.message ?? 'Ошибка получения данных';
      });
  },
});

export const { clearSearchEmployeeError, clearCreateEmployeeError } =
  employeeSlice.actions;

export const {
  selectSearсhEmployee,
  selectIsSearchEmployeeLoading,
  selectSearchEmployeeError,

  selectCreateEmployee,
  selectIsCreateEmployeeLoading,
  selectCreateEmployeeError,
} = employeeSlice.selectors;
