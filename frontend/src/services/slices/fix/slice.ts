import { createSlice } from '@reduxjs/toolkit';

import { updateFix } from './actions';

interface IFixState {
  isLoading: boolean;
  error: string | null;
}

const initialState: IFixState = {
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
  },
  selectors: {
    selectIsLoadingFixs: (state: IFixState) => state.isLoading,
    selectError: (state: IFixState) => state.error,
  },
  extraReducers: (builder) => {
    builder
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

export const { clearError } = fixSlice.actions;
export const { selectIsLoadingFixs, selectError } = fixSlice.selectors;
