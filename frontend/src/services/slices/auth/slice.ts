import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { checkAccessToken, loginEmployee, logoutEmployee } from './actions';

import { IEmployee } from '../../../utils/api.interface';

interface IAuthState {
  employee: IEmployee | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checking: boolean;
  error: string | null;
}

const initialState: IAuthState = {
  employee: null,
  isAuthenticated: false,
  isLoading: false,
  checking: true,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    selectEmployee: (state: IAuthState) => state.employee,
    selectIsAuthenticated: (state: IAuthState) => state.isAuthenticated,
    selectIsLoading: (state: IAuthState) => state.isLoading,
    selectIsChecking: (state: IAuthState) => state.checking,
    selectError: (state: IAuthState) => state.error,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для loginUser
      .addCase(loginEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginEmployee.fulfilled,
        (state, action: PayloadAction<IEmployee>) => {
          state.employee = action.payload;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        },
      )
      .addCase(loginEmployee.rejected, (state, action) => {
        state.employee = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.error.message ?? 'Неверный логин или пароль';
      })
      // Обработчик для logoutUser
      .addCase(logoutEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Очищаем ошибку при начале выхода
      })
      .addCase(logoutEmployee.fulfilled, (state) => {
        state.employee = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutEmployee.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка при выходе из системы';
      })
      // Обработчик для checkRefreshToken
      .addCase(checkAccessToken.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки
        state.checking = true;
      })
      .addCase(checkAccessToken.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.isLoading = false; // Сбрасываем флаг после успешного выполнения
        state.checking = false;
        state.error = null;
      })
      .addCase(checkAccessToken.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isLoading = false; // Сбрасываем флаг после ошибки
        state.checking = false;
        state.error = action.error.message ?? 'Ошибка токена';
      });
  },
});

export const { clearError } = authSlice.actions;

export const {
  selectIsAuthenticated,
  selectIsLoading,
  selectIsChecking,
  selectEmployee,
  selectError,
} = authSlice.selectors;
