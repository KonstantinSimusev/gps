import { Transform } from 'class-transformer';

import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class SearchEmployeeDTO {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: 'Цех не может быть пустым' })
  @IsString({ message: 'Цех должен быть строкой' })
  @MinLength(1, { message: 'Цех должен быть от 1 символа' })
  @MaxLength(50, { message: 'Цех не может превышать 50 символов' })
  workshopCode: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: 'Номер бригады не может быть пустым' })
  @IsString({ message: 'Номер бригады должен быть строкой' })
  @Matches(/^[1-5]$/, { message: 'Номер бригады должен быть от 1 до 5' })
  teamNumber: string;
}
