import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsPositive, Max, Min } from 'class-validator';

export class CreateShiftDTO {
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(2)
  shiftNumber: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5)
  teamNumber: number;
}
