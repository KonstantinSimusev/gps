import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IList, IFix } from '../../../utils/api.interface';
import { getFixs, updateFix } from './actions';

interface IFixState {
  fix: IFix | null;
  fixs: IFix[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IFixState = {
  fix: null,
  fixs: [],
  isLoading: false,
  error: null,
};

export const fixSlice = createSlice({
  name: 'fix',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetFixs: (state) => {
      state.fixs = [];
      state.error = null;
    },
  },
  selectors: {
    // Новый селектор: получает раскрепление по id
    selectFixById: (state: IFixState, id: string) => {
      return state.fixs.find((item) => item.id === id) || null;
    },
    selectFixs: (state: IFixState) => state.fixs,
    selectIsLoadingFixs: (state: IFixState) => state.isLoading,
    selectError: (state: IFixState) => state.error,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для getFixs
      .addCase(getFixs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getFixs.fulfilled,
        (state, action: PayloadAction<IList<IFix>>) => {
          state.fixs = action.payload.items;
          state.isLoading = false;
          state.error = null;
        },
      )
      .addCase(getFixs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка создания раскреплений';
      })
      // Обработчик для updateSFix
      .addCase(updateFix.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFix.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateFix.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка обновления раскрепления';
      });
  },
});

export const { clearError, resetFixs } = fixSlice.actions;
export const { selectFixById, selectFixs, selectIsLoadingFixs, selectError } =
  fixSlice.selectors;
