import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IList, IResidue } from '../../../utils/api.interface';
import { getResidues, updateResidue } from './actions';

interface IResidueState {
  residue: IResidue | null;
  residues: IResidue[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IResidueState = {
  residue: null,
  residues: [],
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
    resetResidues: (state) => {
      state.residues = [];
      state.error = null;
    },
  },
  selectors: {
    // Новый селектор: получает упаковку по id
    selectResidueById: (state: IResidueState, id: string) => {
      return state.residues.find((item) => item.id === id) || null;
    },
    selectResidues: (state: IResidueState) => state.residues,
    selectIsLoadingResidues: (state: IResidueState) => state.isLoading,
    selectError: (state: IResidueState) => state.error,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для getResidues
      .addCase(getResidues.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getResidues.fulfilled,
        (state, action: PayloadAction<IList<IResidue>>) => {
          state.residues = action.payload.items;
          state.isLoading = false;
          state.error = null;
        },
      )
      .addCase(getResidues.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка создания остатков';
      })
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

export const { clearError, resetResidues } = residueSlice.actions;
export const {
  selectResidueById,
  selectResidues,
  selectIsLoadingResidues,
  selectError,
} = residueSlice.selectors;
