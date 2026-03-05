import { Transform } from 'class-transformer';

import {
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
  MaxLength,
} from 'class-validator';

export class AuthDTO {
  @Transform(({ value }) => value.trim())
  @IsString({ message: 'Логин должен быть строкой' })
  @IsNotEmpty({ message: 'Логин не может быть пустым' })
  @Matches(/^\S+$/, { message: 'Логин не должен содержать лишних пробелов' })
  @MinLength(8, { message: 'Логин должен быть от 8 символов' })
  @MaxLength(50, { message: 'Логин не должен превышать 50 символов' })
  login: string;

  @Transform(({ value }) => value.trim())
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @Matches(/^\S+$/, { message: 'Пароль не должен содержать лишних пробелов' })
  @MinLength(8, { message: 'Пароль должно быть от 8 символов' })
  @MaxLength(50, { message: 'Пароль не должен превышать 50 символов' })
  password: string;
}
