import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class UpdateUserShiftDTO {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;

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
}
