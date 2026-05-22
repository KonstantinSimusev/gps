import { Transform } from 'class-transformer';
import { MaxLength, Matches, MinLength } from 'class-validator';

import { toString } from '../../../shared/utils/utils';

export class AuthDto {
  @Transform(({ value }) => toString(value))
  @Matches(/^\S+$/, { message: 'Логин не должен содержать лишних пробелов' })
  @MinLength(8, { message: 'Логин должен быть от 8 символов' })
  @MaxLength(50, { message: 'Логин не должен превышать 50 символов' })
  login: string;

  @Transform(({ value }) => toString(value))
  @Matches(/^\S+$/, { message: 'Пароль не должен содержать лишних пробелов' })
  @MinLength(8, { message: 'Пароль должно быть от 8 символов' })
  @MaxLength(50, { message: 'Пароль не должен превышать 50 символов' })
  password: string;
}
