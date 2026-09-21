import { Transform, Type } from 'class-transformer';

import {
  IsBoolean,
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

import { toBoolean, toNumber, toString } from '../../../shared/utils/utils';

export class UpdateEmployeeDto {
  @IsNotEmpty({ message: 'ID сотрудника не может быть пустым' })
  @IsUUID('4', { message: 'ID должен быть корректным UUID v4' })
  id: string;

  @Transform(({ value }) => toString(value))
  @MinLength(2, { message: 'Фамилия должна быть от 2 символов' })
  @MaxLength(50, { message: 'Фамилия не может превышать 50 символов' })
  lastName: string;

  @Transform(({ value }) => toString(value))
  @MinLength(2, { message: 'Имя должно быть от 2 символов' })
  @MaxLength(50, { message: 'Имя не может превышать 50 символов' })
  firstName: string;

  @Transform(({ value }) => toString(value))
  @MinLength(2, { message: 'Отчество должно быть от 2 символов' })
  @MaxLength(50, { message: 'Отчество не может превышать 50 символов' })
  patronymic: string;

  @Transform(({ value }) => toNumber(value))
  @IsInt({ message: 'Личный номер должен быть целым числом' })
  @Min(1, { message: 'Личный номер должен быть не менее 1' })
  @Max(999999999, { message: 'Личный номер должен быть не более 999999999' })
  personalNumber: number;

  @Transform(({ value }) => toNumber(value))
  @IsInt({ message: 'Номер бригады должен быть целым числом' })
  @Min(1, { message: 'Номер бригады должен быть не менее 1' })
  @Max(5, { message: 'Номер бригады должен быть не более 5' })
  teamNumber: number;

  @Transform(({ value }) => toNumber(value))
  @IsInt({ message: 'Штатная позиция должна быть целым числом' })
  @Min(1, { message: 'Штатная позиция должна быть не менее 1' })
  @Max(999999999, { message: 'Штатная позиция должна быть не более 999999999' })
  positionCode: number;

  @Transform(({ value }) => toNumber(value))
  @IsInt({ message: 'Код разряда должен быть целым числом' })
  @Min(1, { message: 'Код разряда должен быть не менее 1' })
  @Max(99, { message: 'Код разряда не должен превышать 99' })
  gradeCode: number;

  @Transform(({ value }) => toString(value))
  @MinLength(1, { message: 'Код графика не может быть пустым' })
  @MaxLength(20, { message: 'Код графика не должен превышать 20 символов' })
  scheduleCode: string;

  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsInt({ message: 'Номер бригады должен быть целым числом' })
  @Min(1, { message: 'Номер бригады должен быть не менее 1' })
  @Max(5, { message: 'Номер бригады должен быть не более 5' })
  currentTeamNumber: number | null;

  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsInt({ message: 'Штатная позиция должна быть целым числом' })
  @Min(1, { message: 'Штатная позиция должна быть не менее 1' })
  @Max(999999999, { message: 'Штатная позиция должна быть не более 999999999' })
  currentPositionCode: number | null;

  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsInt({ message: 'Код разряда должен быть целым числом' })
  @Min(1, { message: 'Код разряда должен быть не менее 1' })
  @Max(99, { message: 'Код разряда не должен превышать 99' })
  currentGradeCode: number | null;

  @Transform(({ value }) => toString(value))
  @IsOptional()
  @MinLength(1, { message: 'Код графика не может быть пустым' })
  @MaxLength(20, { message: 'Код графика не должен превышать 20 символов' })
  currentScheduleCode: string | null;

  @Type(() => Date)
  @IsDate({ message: 'Дата рождения должна быть валидной датой' })
  birthDay: Date;

  @Type(() => Date)
  @IsDate({ message: 'Дата рождения должна быть валидной датой' })
  startDate: Date;

  @Type(() => Date)
  @IsOptional()
  @IsDate({ message: 'Дата увольнения должна быть валидной датой' })
  endDate: Date | null;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean({ message: 'Доступ должен быть true или false' })
  hasAccess: boolean;
}
