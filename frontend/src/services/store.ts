import { combineSlices, configureStore } from '@reduxjs/toolkit';
import {
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from 'react-redux';
import { authSlice } from './slices/auth/slice';
import { shiftSlice } from './slices/shift/slice';
import { userShiftSlice } from './slices/user-shift/slice';
import { productionSlice } from './slices/production/slice';
import { shipmentSlice } from './slices/shipment/slice';
import { packSlice } from './slices/pack/slice';
import { fixSlice } from './slices/fix/slice';
import { residueSlice } from './slices/residue/slice';
import { userSlice } from './slices/user/slice';
import { reportSlice } from './slices/report/slice';

export const rootReducer = combineSlices(
  authSlice,
  shiftSlice,
  userShiftSlice,
  productionSlice,
  shipmentSlice,
  packSlice,
  fixSlice,
  residueSlice,
  userSlice,
  reportSlice,
);

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();
