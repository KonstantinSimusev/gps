import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getShipmentsApi,
  updateShipmentApi,
} from '../../../utils/api/shipment.api';

import { IList, IShipment, ISuccess } from '../../../utils/api.interface';

import { delay } from '../../../utils/utils';

export const getShipments = createAsyncThunk(
  'shift/shipment',
  async (shiftId: string): Promise<IList<IShipment>> => {
    try {
      const response = await getShipmentsApi(shiftId);

      // Добавляем задержку кода
      // await delay();

      if (!response) {
        throw new Error();
      }

      return response;
    } catch (error) {
      // Добавляем задержку кода
      // await delay();

      // Пойдет в rejected
      throw error;
    }
  },
);

export const updateShipment = createAsyncThunk(
  'shipment/update',
  async (payload: IShipment): Promise<ISuccess> => {
    try {
      // Вызываем API функцию
      const response = await updateShipmentApi(payload);

      // Добавляем задержку кода
      await delay();

      if (!response) {
        throw new Error();
      }

      return response;
    } catch (error) {
      // Добавляем задержку кода
      // await delay();

      throw error;
    }
  },
);
