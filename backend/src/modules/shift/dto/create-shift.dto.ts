import { Transform, Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateShiftDto {
  @Type(() => Date)
  @IsDate({ message: 'Дата смены должна быть валидной датой' })
  shiftDate: Date;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty({ message: 'Номер смены не может быть пустым' })
  @IsInt({ message: 'Номер смены должен быть числом' })
  @Min(1, { message: 'Номер смены должен быть не менее 1' })
  @Max(2, { message: 'Номер смены должен быть не более 2' })
  shiftNumber: number;
}
