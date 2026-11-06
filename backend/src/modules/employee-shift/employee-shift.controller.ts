import { Controller, Delete, Param, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../auth/guards/auth.guard';

import { IEmployeeShift, ISuccess } from '../../shared/interfaces/api.interface';
import { EmployeeShiftIdDto } from './dto/employee-shift-id.dto';

import { EmployeeShiftService } from './employee-shift.service';

@Controller('employee-shift')
export class EmployeeShiftController {
  constructor(private readonly employeeShiftService: EmployeeShiftService) {}}
