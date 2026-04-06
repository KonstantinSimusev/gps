import { IsUUID, IsNotEmpty } from 'class-validator';

export class EmployeeIdDTO {
  @IsNotEmpty({ message: 'ID сотрудника не может быть пустым' })
  @IsUUID('4', { message: 'ID должен быть корректным UUID v4' })
  id: string;
}
