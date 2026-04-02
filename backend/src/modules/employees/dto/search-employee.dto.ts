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
  @IsNotEmpty({ message: 'Личный номер не может быть пустым' })
  @IsString({ message: 'Личный номер должен быть строкой' })
  @Matches(/^\d+$/, { message: 'Личный номер должен содержать только цифры' })
  @MinLength(1, { message: 'Личный номер должен быть от 1 символа' })
  @MaxLength(10, { message: 'Личный номер не может превышать 10 символов' })
  personalNumber: string;
}
