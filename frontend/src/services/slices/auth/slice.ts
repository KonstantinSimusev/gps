import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { checkAccessToken, loginEmployee, logoutEmployee } from './actions';

import { IProfile } from '../../../utils/api.interface';

interface IAuthState {
  profile: IProfile | null;
  isAuthenticated: boolean;
  isRole: boolean;
  isAuthLoading: boolean;
  checking: boolean;
  authError: string | null;
}

const initialState: IAuthState = {
  profile: null,
  isAuthenticated: false,
  isRole: false,
  isAuthLoading: false,
  checking: true,
  authError: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.authError = null;
    },
  },
  selectors: {
    selectProfile: (state: IAuthState) => state.profile,
    selectIsAuthenticated: (state: IAuthState) => state.isAuthenticated,
    selectIsAuthLoading: (state: IAuthState) => state.isAuthLoading,
    selectIsChecking: (state: IAuthState) => state.checking,
    selectAuthError: (state: IAuthState) => state.authError,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для loginEmployee
      .addCase(loginEmployee.pending, (state) => {
        state.isAuthLoading = true;
        state.authError = null;
      })
      .addCase(
        loginEmployee.fulfilled,
        (state, action: PayloadAction<IProfile>) => {
          state.profile = action.payload;
          state.isAuthenticated = true;
          state.isAuthLoading = false;
          state.authError = null;
        },
      )
      .addCase(loginEmployee.rejected, (state, action) => {
        state.profile = null;
        state.isAuthenticated = false;
        state.isAuthLoading = false;
        state.authError = action.error.message ?? 'Неверные учётные данные';
      })
      // Обработчик для checkRefreshToken
      .addCase(checkAccessToken.pending, (state) => {
        state.isAuthLoading = true; // Устанавливаем флаг загрузки
        state.checking = true;
      })
      .addCase(
        checkAccessToken.fulfilled,
        (state, action: PayloadAction<IProfile>) => {
          state.profile = action.payload;
          state.isAuthenticated = true;
          state.isAuthLoading = false; // Сбрасываем флаг после успешного выполнения
          state.checking = false;
          state.authError = null;
        },
      )
      .addCase(checkAccessToken.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isAuthLoading = false; // Сбрасываем флаг после ошибки
        state.checking = false;
        state.authError = action.error.message ?? 'Ошибка токена';
      })
      // Обработчик для logoutEmployee
      .addCase(logoutEmployee.pending, (state) => {
        state.isAuthLoading = true;
        state.authError = null; // Очищаем ошибку при начале выхода
      })
      .addCase(logoutEmployee.fulfilled, (state) => {
        state.profile = null;
        state.isAuthenticated = false;
        state.isAuthLoading = false;
        state.authError = null;
      })
      .addCase(logoutEmployee.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isAuthLoading = false;
        state.authError = action.error.message ?? 'Ошибка при выходе из системы';
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export const {
  selectProfile,
  selectIsAuthenticated,
  selectIsAuthLoading,
  selectIsChecking,
  selectAuthError,
} = authSlice.selectors;
