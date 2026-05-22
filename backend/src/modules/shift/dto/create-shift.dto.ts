import { Transform, Type } from 'class-transformer';
import { IsDate, IsInt, Max, Min } from 'class-validator';

import { toNumber } from '../../../shared/utils/utils';

export class CreateShiftDto {
  @Type(() => Date)
  @IsDate({ message: 'Дата смены должна быть валидной датой' })
  shiftDate: Date;

  @Transform(({ value }) => toNumber(value))
  @IsInt({ message: 'Номер смены должен быть числом' })
  @Min(1, { message: 'Номер смены должен быть не менее 1' })
  @Max(2, { message: 'Номер смены должен быть не более 2' })
  shiftNumber: number;
}
