import { createSlice } from '@reduxjs/toolkit';

import { updateShipment } from './actions';

interface IShipmentState {
  isLoading: boolean;
  error: string | null;
}

const initialState: IShipmentState = {
  isLoading: false,
  error: null,
};

export const shipmentSlice = createSlice({
  name: 'shipment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    selectIsLoadingShipments: (state: IShipmentState) => state.isLoading,
    selectError: (state: IShipmentState) => state.error,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для updateShipment
      .addCase(updateShipment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateShipment.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateShipment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка обновления отгрузки';
      });
  },
});

export const { clearError } = shipmentSlice.actions;
export const { selectIsLoadingShipments, selectError } =
  shipmentSlice.selectors;
