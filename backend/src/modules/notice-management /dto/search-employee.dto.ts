import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

import { toNumber } from '../../../shared/utils/utils';

export class SearchEmployeeDto {
  @Transform(({ value }) => toNumber(value))
  @IsInt({ message: 'Личный номер должен быть целым числом' })
  @Min(1, { message: 'Личный номер должен быть не менее 1' })
  @Max(999999999, { message: 'Личный номер должен быть не более 999999999' })
  personalNumber: number;
}
