import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class ShiftDateDto {
  @Type(() => Date)
  @IsDate({ message: 'Дата смены должна быть валидной датой' })
  shiftDate: Date;
}
