import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDTO {
  @IsString({ message: 'Логин должен быть строкой' })
  @IsNotEmpty({ message: 'Логин не может быть пустым' })
  @MinLength(8, { message: 'Логин должен содержать минимум 8 символов' })
  login: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  password: string;
}
