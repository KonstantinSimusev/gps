import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { EProfession, ERole } from '../../../shared/enums/enums';

export class CreateUserDTO {
  @IsNumber()
  @IsNotEmpty()
  positionCode: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  patronymic: string;

  @IsEnum(EProfession)
  @IsNotEmpty()
  profession: EProfession;

  @IsNumber()
  @IsNotEmpty()
  grade: number;

  @IsNumber()
  @IsNotEmpty()
  personalNumber: number;

  @IsNumber()
  @IsNotEmpty()
  teamNumber: number;

  @IsNumber()
  @IsNotEmpty()
  currentTeamNumber: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(10)
  workSchedule: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  workshopCode: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(512)
  password: string;

  @IsEnum(ERole)
  @IsNotEmpty()
  role: ERole;

  @IsNumber()
  @IsNotEmpty()
  sortOrder: number;
}
