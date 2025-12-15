import { IsString, IsNumber, Min, Max, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserShiftDTO {
  @IsString()
  @IsNotEmpty()
  workStatus: string;

  @IsString()
  @IsNotEmpty()
  workPlace: string;

  @IsString()
  @IsNotEmpty()
  shiftProfession: string;

  @IsNumber()
  @Min(0)
  @Max(20)
  workHours: number;

  @IsUUID()
  userId: string;

  @IsUUID()
  shiftId: string;
}
