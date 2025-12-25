import { createSlice } from '@reduxjs/toolkit';

import { updateProduction } from './actions';

interface IProductionState {
  isLoading: boolean;
  error: string | null;
}

const initialState: IProductionState = {
  isLoading: false,
  error: null,
};

export const productionSlice = createSlice({
  name: 'production',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    selectIsLoadingProductions: (state: IProductionState) => state.isLoading,
    selectError: (state: IProductionState) => state.error,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для updatePrction
      .addCase(updateProduction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduction.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateProduction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка обновления производства';
      });
  },
});

export const { clearError } = productionSlice.actions;
export const { selectIsLoadingProductions, selectError } =
  productionSlice.selectors;
