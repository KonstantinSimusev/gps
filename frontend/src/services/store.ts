import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from 'react-redux';

import { accountsSlice } from './slices/account/slice';
import { authSlice } from './slices/auth/slice';
import { employeeSlice } from './slices/employee/slice';

export const rootReducer = combineSlices(
  authSlice,
  employeeSlice,
  accountsSlice,
);

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();
