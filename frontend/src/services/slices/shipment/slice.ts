import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IList, IShipment } from '../../../utils/api.interface';
import { getShipments, updateShipment } from './actions';

interface IShipmentState {
  shipment: IShipment | null;
  shipments: IShipment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IShipmentState = {
  shipment: null,
  shipments: [],
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
    resetShipments: (state) => {
      state.shipments = [];
      state.error = null;
    },
  },
  selectors: {
    // Новый селектор: получает отгрузку по id
    selectShipmentById: (state: IShipmentState, id: string) => {
      return state.shipments.find((item) => item.id === id) || null;
    },
    selectShipments: (state: IShipmentState) => state.shipments,
    selectIsLoadingShipments: (state: IShipmentState) => state.isLoading,
    selectError: (state: IShipmentState) => state.error,
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для getShipments
      .addCase(getShipments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getShipments.fulfilled,
        (state, action: PayloadAction<IList<IShipment>>) => {
          state.shipments = action.payload.items;
          state.isLoading = false;
          state.error = null;
        },
      )
      .addCase(getShipments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка создания отгрузок';
      })
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

export const { clearError, resetShipments } = shipmentSlice.actions;
export const {
  selectShipmentById,
  selectShipments,
  selectIsLoadingShipments,
  selectError,
} = shipmentSlice.selectors;
