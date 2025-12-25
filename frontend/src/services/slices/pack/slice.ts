import { createSlice } from '@reduxjs/toolkit';

import { updatePack } from './actions';

interface IPackState {
  isLoading: boolean;
  error: string | null;
}

const initialState: IPackState = {
  isLoading: false,
  error: null,
};

export const packSlice = createSlice({
  name: 'pack',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    selectIsLoadingPacks: (state: IPackState) => state.isLoading,
    selectError: (state: IPackState) => state.error,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для updatePack
      .addCase(updatePack.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePack.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updatePack.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка обновления упаковки';
      });
  },
});

export const { clearError } = packSlice.actions;
export const { selectIsLoadingPacks, selectError } = packSlice.selectors;
