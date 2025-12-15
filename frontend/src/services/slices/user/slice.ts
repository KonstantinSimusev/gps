import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getProfessions } from './actions';

import type { IList, IProfession } from '../../../utils/api.interface';

interface IUserState {
  professions: IProfession[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IUserState = {
  professions: [],
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    selectProfessions: (state: IUserState) => state.professions,
    selectIsLoadingProfessions: (state: IUserState) => state.isLoading,
    selectError: (state: IUserState) => state.error,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для getProfessions
      .addCase(getProfessions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getProfessions.fulfilled,
        (state, action: PayloadAction<IList<IProfession>>) => {
          state.professions = action.payload.items;
          state.isLoading = false;
          state.error = null;
        },
      )
      .addCase(getProfessions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка получения профессий';
      });
  },
});

export const { clearError } = userSlice.actions;
export const { selectProfessions, selectIsLoadingProfessions, selectError } =
  userSlice.selectors;
