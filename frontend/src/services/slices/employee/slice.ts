import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IAccountInfo, IEmployeeInfo } from '../../../utils/api.interfaces';

import { createEmployee, searchEmployee, updateEmployee } from './actions';

interface IEmployeeState {
  employeeInfo: IEmployeeInfo | null;
  accountInfo: IAccountInfo | null;

  isSearchEmployeeLoading: boolean;
  searchEmployeeError: string | null;

  isCreateEmployeeLoading: boolean;
  createEmployeeError: string | null;

  isUpdateEmployeeLoading: boolean;
  updateEmployeeError: string | null;
}

const initialState: IEmployeeState = {
  employeeInfo: null,
  accountInfo: null,

  isSearchEmployeeLoading: false,
  searchEmployeeError: null,

  isCreateEmployeeLoading: false,
  createEmployeeError: null,

  isUpdateEmployeeLoading: false,
  updateEmployeeError: null,
};

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearEmployeeInfo: (state) => {
      state.employeeInfo = null;
    },
    clearEmployeeAccountInfo: (state) => {
      state.accountInfo = null;
    },
    clearSearchEmployeeError: (state) => {
      state.searchEmployeeError = null;
    },
    clearCreateEmployeeError: (state) => {
      state.createEmployeeError = null;
    },
    clearUpdateEmployeeError: (state) => {
      state.updateEmployeeError = null;
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

    selectIsUpdateEmployeeLoading: (state: IEmployeeState) =>
      state.isUpdateEmployeeLoading,
    selectUpdateEmployeeError: (state: IEmployeeState) =>
      state.updateEmployeeError,
  },
  extraReducers: (builder) => {
    builder
      // Обработчики для searchEmployee
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
      })
      // Обработчик для updateEmployee
      .addCase(updateEmployee.pending, (state) => {
        state.isUpdateEmployeeLoading = true;
        state.updateEmployeeError = null;
      })
      .addCase(
        updateEmployee.fulfilled,
        (state, action: PayloadAction<IEmployeeInfo>) => {
          state.employeeInfo = action.payload;
          state.isUpdateEmployeeLoading = false;
          state.updateEmployeeError = null;
        },
      )
      .addCase(updateEmployee.rejected, (state, action) => {
        state.isUpdateEmployeeLoading = false;
        state.updateEmployeeError =
          action.error.message ?? 'Ошибка обновления данных сотрудника';
      });
  },
});

export const {
  clearEmployeeInfo,
  clearEmployeeAccountInfo,
  clearSearchEmployeeError,
  clearCreateEmployeeError,
  clearUpdateEmployeeError,
} = employeeSlice.actions;

export const {
  selectSearсhEmployee,
  selectIsSearchEmployeeLoading,
  selectSearchEmployeeError,

  selectCreateEmployee,
  selectIsCreateEmployeeLoading,
  selectCreateEmployeeError,

  selectIsUpdateEmployeeLoading,
  selectUpdateEmployeeError,
} = employeeSlice.selectors;
