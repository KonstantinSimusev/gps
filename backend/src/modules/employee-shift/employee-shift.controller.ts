import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { AuthGuard } from '../auth/guards/auth.guard';
import { IEmployeeShift, IList } from '../../shared/interfaces/api.interface';
import { EmployeeShiftService } from './employee-shift.service';

@Controller('employee-shift')
export class EmployeeShiftController {
  constructor(private readonly employeeShiftService: EmployeeShiftService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  async getEmployeeShiftsByShiftId(
    @Param('id') id: string,
  ): Promise<IList<IEmployeeShift>> {
    return this.employeeShiftService.getEmployeeShiftsByShiftId(id);
  }
}
