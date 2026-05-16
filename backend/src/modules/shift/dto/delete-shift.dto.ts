import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeleteShiftDto {
  @IsNotEmpty({ message: 'ID смены не может быть пустым' })
  @IsUUID('4', { message: 'ID должен быть корректным UUID v4' })
  id: string;
}
