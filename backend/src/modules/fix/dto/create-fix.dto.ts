import {
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
  IsUUID,
  IsEnum,
} from 'class-validator';

import { ELocation, ERailway } from '../../../shared/enums/enums';

export class CreateFixDTO {
  @IsEnum(ELocation)
  @IsNotEmpty()
  location: ELocation;

  @IsEnum(ERailway)
  @IsNotEmpty()
  railway: ERailway;

  @IsNumber()
  @Min(0)
  @Max(1000)
  count: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(20)
  sortOrder: number;

  @IsUUID()
  shiftId: string;
}
