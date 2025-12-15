import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class UpdateShipmentDTO {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNumber()
  @Min(0)
  @Max(1000)
  count: number;
}
