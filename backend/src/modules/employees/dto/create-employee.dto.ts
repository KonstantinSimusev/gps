import { Transform } from 'class-transformer';

import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
  IsDate,
} from 'class-validator';

export class CreateEmployeeDTO {
  @Transform(({ value }) => value.trim()) // удаляем пробелы по краям
  @IsNotEmpty({ message: 'Фамилия не может быть пустой' })
  @IsString({ message: 'Фамилия должна быть строкой' })
  @Matches(/^\S+$/, { message: 'Фамилия не должна содержать лишних пробелов' })
  @MinLength(2, { message: 'Фамилия должна быть от 2 символов' })
  @MaxLength(50, { message: 'Фамилия не может превышать 50 символов' })
  lastName: string;

  @Transform(({ value }) => value.trim())
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  @Matches(/^\S+$/, { message: 'Имя не должно содержать лишних пробелов' })
  @MinLength(2, { message: 'Имя должно быть от 2 символов' })
  @MaxLength(30, { message: 'Имя не может превышать 30 символов' })
  firstName: string;

  @Transform(({ value }) => value.trim())
  @IsString({ message: 'Отчество должно быть строкой' })
  @IsNotEmpty({ message: 'Отчество не может быть пустым' })
  @Matches(/^\S+$/, { message: 'Отчество не должно содержать лишних пробелов' })
  @MinLength(2, { message: 'Отчество должно быть от 2 символов' })
  @MaxLength(40, { message: 'Отчество не может превышать 40 символов' })
  patronymic: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: 'Личный номер не может быть пустым' })
  @IsString({ message: 'Личный номер должен быть строкой' })
  @Matches(/^\d+$/, { message: 'Личный номер должен содержать только цифры' })
  @MinLength(1, { message: 'Личный номер должен быть от 1 символа' })
  @MaxLength(10, { message: 'Личный номер не может превышать 10 символов' })
  personalNumber: string;

  @IsNotEmpty({ message: 'Дата рождения не может быть пустой' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Дата рождения должна быть валидной датой' })
  birthDay: Date;

  @IsNotEmpty({ message: 'Дата начала работы не может быть пустой' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Дата приема на работу должна быть валидной датой' })
  startDate: Date;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: 'Штатная позиция не может быть пустой' })
  @IsString({ message: 'Штатная позиция должна быть строкой' })
  @Matches(/^\d+$/, {
    message: 'Штатная позиция должна содержать только цифры',
  })
  @MinLength(1, { message: 'Штатная позиция должна быть от 1 символа' })
  @MaxLength(10, { message: 'Штатная позиция не может превышать 10 символов' })
  positionCode: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: 'Номер бригады не может быть пустым' })
  @IsString({ message: 'Номер бригады должен быть строкой' })
  @Matches(/^[1-5]$/, { message: 'Номер бригады должен быть от 1 до 5' })
  teamNumber: string;
}
