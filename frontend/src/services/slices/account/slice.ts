import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IAccountInfo } from '../../../utils/api.interface';
import { updateLoginAndPassword } from './actions';

interface IAccountsState {
  accountInfo: IAccountInfo | null;
  isUpdateAccountLoading: boolean;
  updateAccountError: string | null;
}

const initialState: IAccountsState = {
  accountInfo: null,
  isUpdateAccountLoading: false,
  updateAccountError: null,
};

export const accountsSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    clearUpdateAccountError: (state) => {
      state.updateAccountError = null;
    },
  },
  selectors: {
    selectUpdateAccountInfo: (state: IAccountsState) => state.accountInfo,
    selectIsUpdateAccountLoading: (state: IAccountsState) =>
      state.isUpdateAccountLoading,
    selectUpdateAccountError: (state: IAccountsState) =>
      state.updateAccountError,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для updateLoginAndPassword
      .addCase(updateLoginAndPassword.pending, (state) => {
        state.isUpdateAccountLoading = true;
        state.updateAccountError = null;
      })
      .addCase(
        updateLoginAndPassword.fulfilled,
        (state, action: PayloadAction<IAccountInfo>) => {
          state.accountInfo = action.payload;
          state.isUpdateAccountLoading = false;
          state.updateAccountError = null;
        },
      )
      .addCase(updateLoginAndPassword.rejected, (state, action) => {
        state.isUpdateAccountLoading = false;
        state.updateAccountError =
          action.error.message ?? 'Ошибка обновления данных сотрудника';
      });
  },
});

export const { clearUpdateAccountError } = accountsSlice.actions;

export const {
  selectUpdateAccountInfo,
  selectIsUpdateAccountLoading,
  selectUpdateAccountError,
} = accountsSlice.selectors;
