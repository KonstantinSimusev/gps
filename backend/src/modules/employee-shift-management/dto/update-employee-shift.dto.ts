import { Transform, Type } from 'class-transformer';

import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import {
  toNumber,
  toOptionalBoolean,
  toOptionalNumber,
  toOptionalString,
  toString,
} from '../../../shared/utils/utils';

export interface IUpdateEmployeeShift {
  shiftId: string;
  employeeShiftId: string;
  employeeId: string;

  currentPositionCode: number; // берем из распоряжения, если нет из КЛС
  currentGradeCode: number; // берем из распоряжения, если нет из КЛС
  currentPaymentCode: string; // берем из распоряжения, если нет из КЛС
  attendanceCode: string;
  minutes: number;
  isPresent: boolean | null;
  workplaceName: string | null;

  documentTitleCode: string | null;
  documentReasonCode: string | null;
  documentActionCode: string | null;
  documentPaymentCode: string | null;
  documentStartDate: string | null;
  documentEndDate: string | null;
  documentAbsentEmpNumber: number | null;
}

export class UpdateEmployeeShiftDto {
  @IsNotEmpty({ message: 'ID смены не может быть пустым' })
  @IsUUID('4', { message: 'ID должен быть корректным UUID v4' })
  shiftId: string;

  @IsNotEmpty({ message: 'ID смены сотрудника не может быть пустым' })
  @IsUUID('4', { message: 'ID должен быть корректным UUID v4' })
  employeeShiftId: string;

  @IsNotEmpty({ message: 'ID сотрудника не может быть пустым' })
  @IsUUID('4', { message: 'ID должен быть корректным UUID v4' })
  employeeId: string;

  @Transform(({ value }) => toNumber(value))
  @IsInt({ message: 'Штатная позиция должна быть целым числом' })
  @Min(1, { message: 'Штатная позиция должна быть не менее 1' })
  @Max(999999999, { message: 'Штатная позиция должна быть не более 999999999' })
  currentPositionCode: number;

  @Transform(({ value }) => toString(value))
  @MinLength(1, { message: 'Код системы оплаты не может быть пустым' })
  @MaxLength(10, { message: 'Код оплаты не должен превышать 10 символов' })
  currentPaymentCode: string;

  @Transform(({ value }) => toString(value))
  @MinLength(1, { message: 'Код посещения не может быть пустым' })
  @MaxLength(10, { message: 'Код посещения не должен превышать 10 символов' })
  attendanceCode: string;

  @Transform(({ value }) => toNumber(value))
  @IsInt({ message: 'Минуты должны быть целым числом' })
  @Min(0, { message: 'Минуты должны быть не менее 0' })
  @Max(1000, { message: 'Минуты должны быть не более 1000' })
  minutes: number;

  @Transform(({ value }) => toOptionalBoolean(value))
  @IsOptional()
  isPresent: boolean | null;

  @Transform(({ value }) => toOptionalString(value))
  @IsOptional()
  workplaceName: string | null;
}
