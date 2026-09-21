import { createSlice } from '@reduxjs/toolkit';

import { IEmployeeShift } from '../../../utils/api.interface';
import { getEmployeeShiftsByShiftId } from './actions';

interface IEmployeeShiftState {
  employeeShifts: IEmployeeShift[] | null;
  isAssignmentComplete: boolean | null;

  isEmployeeShiftsLoading: boolean;
  employeeShiftsError: string | null;
}

const initialState: IEmployeeShiftState = {
  employeeShifts: null,
  isAssignmentComplete: null,

  isEmployeeShiftsLoading: false,
  employeeShiftsError: null,
};

export const employeeShiftSlice = createSlice({
  name: 'employeeShift',
  initialState,
  reducers: {
    clearEmployeeShifts: (state) => {
      state.employeeShifts = null;
      state.isAssignmentComplete = null;
    },
  },
  selectors: {
    selectEmployeeShifts: (state: IEmployeeShiftState) => state.employeeShifts,
    selectIsAssignmentComplete: (state: IEmployeeShiftState) =>
      state.isAssignmentComplete,

    selectIsEmployeeShiftsLoading: (state: IEmployeeShiftState) =>
      state.isEmployeeShiftsLoading,
    selectEmployeeShiftsError: (state: IEmployeeShiftState) =>
      state.employeeShiftsError,
  },
  extraReducers: (builder) => {
    // Обработчики getEmployeeShiftsByShiftId
    builder
      .addCase(getEmployeeShiftsByShiftId.pending, (state) => {
        state.isEmployeeShiftsLoading = true;
        state.employeeShiftsError = null;
        state.isAssignmentComplete = null;
      })
      .addCase(getEmployeeShiftsByShiftId.fulfilled, (state, action) => {
        state.isEmployeeShiftsLoading = false;
        state.employeeShiftsError = null;
        state.employeeShifts = action.payload.items;
        state.isAssignmentComplete = action.payload.isAssignmentComplete;
      })
      .addCase(getEmployeeShiftsByShiftId.rejected, (state, action) => {
        state.isEmployeeShiftsLoading = false;
        state.employeeShiftsError =
          action.error.message ?? 'Не удалось загрузить смены';
        state.isAssignmentComplete = null;
      });
  },
});

// Экспорт действий
export const { clearEmployeeShifts } = employeeShiftSlice.actions;

// Экспорт селекторов
export const {
  selectEmployeeShifts,
  selectIsAssignmentComplete,
  selectIsEmployeeShiftsLoading,
  selectEmployeeShiftsError,
} = employeeShiftSlice.selectors;
