import {
  IsString,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class DeleteUserShiftDTO {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
