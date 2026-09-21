import { IsNotEmpty, IsUUID } from 'class-validator';

export class ShiftIdDto {
  @IsNotEmpty({ message: 'ID смены не может быть пустым' })
  @IsUUID('4', { message: 'ID должен быть корректным UUID v4' })
  id: string;
}
