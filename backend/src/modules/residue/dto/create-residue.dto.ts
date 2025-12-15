import {
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
  IsUUID,
  IsEnum,
} from 'class-validator';

import { EArea, ELocation } from '../../../shared/enums/enums';

export class CreateResidueDTO {
  @IsEnum(ELocation)
  @IsNotEmpty()
  location: ELocation;

  @IsEnum(EArea)
  @IsNotEmpty()
  area: EArea;

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
