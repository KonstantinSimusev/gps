import { IsNumber, IsNotEmpty, IsUUID } from 'class-validator';

export class AddUserShiftDTO {
  @IsNumber()
  @IsNotEmpty()
  personalNumber: number;

  @IsNotEmpty()
  @IsUUID()
  shiftId: string;
}
