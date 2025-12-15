import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IList, IProduction } from '../../../utils/api.interface';
import { getProductions, updateProduction } from './actions';

interface IProductionState {
  pruduction: IProduction | null;
  productions: IProduction[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IProductionState = {
  pruduction: null,
  productions: [],
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
    resetProductions: (state) => {
      state.productions = [];
      state.error = null;
    },
  },
  selectors: {
    // Новый селектор: получает производство по id
    selectProductionById: (state: IProductionState, id: string) => {
      return state.productions.find((prod) => prod.id === id) || null;
    },
    selectProductions: (state: IProductionState) => state.productions,
    selectIsLoadingProductions: (state: IProductionState) => state.isLoading,
    selectError: (state: IProductionState) => state.error,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для getProductions
      .addCase(getProductions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getProductions.fulfilled,
        (state, action: PayloadAction<IList<IProduction>>) => {
          state.productions = action.payload.items;
          state.isLoading = false;
          state.error = null;
        },
      )
      .addCase(getProductions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка создания производств';
      })
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

export const { clearError, resetProductions } = productionSlice.actions;
export const {
  selectProductionById,
  selectProductions,
  selectIsLoadingProductions,
  selectError,
} = productionSlice.selectors;
