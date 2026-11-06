import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteEmployeeShiftDto {
  @IsNotEmpty({ message: 'ID смены не может быть пустым' })
  @IsUUID('4', { message: 'ID должен быть корректным UUID v4' })
  shiftId: string;

  @IsNotEmpty({ message: 'ID смены работника не может быть пустым' })
  @IsUUID('4', { message: 'ID должен быть корректным UUID v4' })
  employeeShiftId: string;
}
