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

export class UpdateDocumentDto {
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

  @Transform(({ value }) => toOptionalString(value))
  @IsOptional()
  documentTitleCode: string | null;

  @Transform(({ value }) => toOptionalString(value))
  @IsOptional()
  documentReasonCode: string | null;

  @Transform(({ value }) => toOptionalString(value))
  @IsOptional()
  documentActionCode: string | null;

  @Transform(({ value }) => toOptionalString(value))
  @IsOptional()
  documentPaymentCode: string | null;

  @Type(() => Date)
  @IsOptional()
  @IsDate({ message: 'Дата должна быть валидной датой' })
  documentStartDate: Date | null;

  @Type(() => Date)
  @IsOptional()
  @IsDate({ message: 'Дата должна быть валидной датой' })
  documentEndDate: Date | null;

  @Transform(({ value }) => toOptionalNumber(value))
  @IsOptional()
  @IsInt({ message: 'Личный номер должен быть целым числом' })
  documentAbsentEmpNumber: number | null;
}
