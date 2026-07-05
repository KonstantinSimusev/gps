import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class CreateShiftDto {
  @Type(() => Date)
  @IsDate({ message: 'Дата смены должна быть валидной датой' })
  shiftDate: Date;
}
