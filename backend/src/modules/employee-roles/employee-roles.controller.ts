import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { EmployeeRolesService } from './employee-roles.service';
import { AuthGuard } from '../auth/guards/auth.guard';

import { ISuccess } from '../../shared/interfaces/api.interface';

@Controller('employee-roles')
export class EmployeeRolesController {
  constructor(private readonly employeeRolesService: EmployeeRolesService) {}
  
  // @Delete(':id')
  // async deleteUser(@Param('id') id: string): Promise<ISuccess> {
  //   return this.personService.deleteUser(id);
  // }
}
