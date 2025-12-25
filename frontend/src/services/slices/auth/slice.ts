import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { checkAccessToken, loginUser, logoutUser } from './actions';

import { IUser } from '../../../utils/api.interface';

interface IAuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checking: boolean;
  error: string | null;
}

const initialState: IAuthState = {
  user: null,
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
    selectUser: (state: IAuthState) => state.user,
    selectIsAuthenticated: (state: IAuthState) => state.isAuthenticated,
    selectIsLoading: (state: IAuthState) => state.isLoading,
    selectIsChecking: (state: IAuthState) => state.checking,
    selectError: (state: IAuthState) => state.error,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для loginUser
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.error.message ?? 'Неверный логин или пароль';
      })
      // Обработчик для checkRefreshToken
      .addCase(checkAccessToken.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки
        state.checking = true;
      })
      .addCase(
        checkAccessToken.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.user = action.payload;
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
      // Обработчик для logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Очищаем ошибку при начале выхода
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка при выходе из системы';
      });
  },
});

export const { clearError } = authSlice.actions;

export const {
  selectIsAuthenticated,
  selectIsLoading,
  selectIsChecking,
  selectUser,
  selectError,
} = authSlice.selectors;
