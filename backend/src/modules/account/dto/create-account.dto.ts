import { Transform } from 'class-transformer';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateAccountDto {
  @Transform(({ value }) => value.trim()) // удаляем пробелы по краям
  @IsNotEmpty({ message: 'Фамилия не может быть пустой' })
  @MinLength(2, { message: 'Фамилия должна быть от 2 символов' })
  @MaxLength(50, { message: 'Фамилия не может превышать 50 символов' })
  lastName: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  @MinLength(2, { message: 'Имя должно быть от 2 символов' })
  @MaxLength(30, { message: 'Имя не может превышать 30 символов' })
  firstName: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: 'Отчество не может быть пустым' })
  @MinLength(2, { message: 'Отчество должно быть от 2 символов' })
  @MaxLength(40, { message: 'Отчество не может превышать 40 символов' })
  patronymic: string;
}
