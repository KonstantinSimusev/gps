import { createSlice } from '@reduxjs/toolkit';

import { updateResidue } from './actions';

interface IResidueState {
  isLoading: boolean;
  error: string | null;
}

const initialState: IResidueState = {
  isLoading: false,
  error: null,
};

export const residueSlice = createSlice({
  name: 'residue',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    selectIsLoadingResidues: (state: IResidueState) => state.isLoading,
    selectError: (state: IResidueState) => state.error,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для updateResidue
      .addCase(updateResidue.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateResidue.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateResidue.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка обновления остатка';
      });
  },
});

export const { clearError } = residueSlice.actions;
export const { selectIsLoadingResidues, selectError } = residueSlice.selectors;
