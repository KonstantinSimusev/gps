import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeleteShiftDTO {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
