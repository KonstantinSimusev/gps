import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IList, IPack } from '../../../utils/api.interface';
import { getPacks, updatePack } from './actions';

interface IPackState {
  pack: IPack | null;
  packs: IPack[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IPackState = {
  pack: null,
  packs: [],
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
    resetPacks: (state) => {
      state.packs = [];
      state.error = null;
    },
  },
  selectors: {
    // Новый селектор: получает упаковку по id
    selectPackById: (state: IPackState, id: string) => {
      return state.packs.find((item) => item.id === id) || null;
    },
    selectPacks: (state: IPackState) => state.packs,
    selectIsLoadingPacks: (state: IPackState) => state.isLoading,
    selectError: (state: IPackState) => state.error,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для getPacks
      .addCase(getPacks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getPacks.fulfilled,
        (state, action: PayloadAction<IList<IPack>>) => {
          state.packs = action.payload.items;
          state.isLoading = false;
          state.error = null;
        },
      )
      .addCase(getPacks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка создания упаковок';
      })
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

export const { clearError, resetPacks } = packSlice.actions;
export const {
  selectPackById,
  selectPacks,
  selectIsLoadingPacks,
  selectError,
} = packSlice.selectors;
