import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { CreateEmployeeDTO } from './create-employee.dto';

export class CreateEmployeesDTO {
  @Type(() => CreateEmployeeDTO)
  @ValidateNested({ each: true })
  employees: CreateEmployeeDTO[];
}
