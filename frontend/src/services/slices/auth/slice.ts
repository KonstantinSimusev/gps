import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { checkAccessToken, loginEmployee, logoutEmployee } from './actions';

import { IProfile } from '../../../utils/api.interface';

interface IAuthState {
  profile: IProfile | null;
  isAuthenticated: boolean;
  isRole: boolean;
  isLoading: boolean;
  checking: boolean;
  error: string | null;
}

const initialState: IAuthState = {
  profile: null,
  isAuthenticated: false,
  isRole: false,
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
    selectProfile: (state: IAuthState) => state.profile,
    selectIsAuthenticated: (state: IAuthState) => state.isAuthenticated,
    selectIsLoading: (state: IAuthState) => state.isLoading,
    selectIsChecking: (state: IAuthState) => state.checking,
    selectError: (state: IAuthState) => state.error,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для loginEmployee
      .addCase(loginEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginEmployee.fulfilled,
        (state, action: PayloadAction<IProfile>) => {
          state.profile = action.payload;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        },
      )
      .addCase(loginEmployee.rejected, (state, action) => {
        state.profile = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.error.message ?? 'Неверные учётные данные';
      })
      // Обработчик для checkRefreshToken
      .addCase(checkAccessToken.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки
        state.checking = true;
      })
      .addCase(
        checkAccessToken.fulfilled,
        (state, action: PayloadAction<IProfile>) => {
          state.profile = action.payload;
          state.isAuthenticated = true;
          state.isLoading = false; // Сбрасываем флаг после успешного выполнения
          state.checking = false;
          state.error = null;
        },
      )
      .addCase(checkAccessToken.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isLoading = false; // Сбрасываем флаг после ошибки
        state.checking = false;
        state.error = action.error.message ?? 'Ошибка токена';
      })
      // Обработчик для logoutEmployee
      .addCase(logoutEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Очищаем ошибку при начале выхода
      })
      .addCase(logoutEmployee.fulfilled, (state) => {
        state.profile = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutEmployee.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка при выходе из системы';
      });
  },
});

export const { clearError } = authSlice.actions;

export const {
  selectProfile,
  selectIsAuthenticated,
  selectIsLoading,
  selectIsChecking,
  selectError,
} = authSlice.selectors;
