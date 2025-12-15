import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class UpdateResidueDTO {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNumber()
  @Min(0)
  @Max(1000)
  count: number;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  shiftId: string;
}
