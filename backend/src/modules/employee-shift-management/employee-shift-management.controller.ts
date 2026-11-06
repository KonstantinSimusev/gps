import { Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common';

import { ISuccess } from '../../shared/interfaces/api.interface';
import { CreateEmployeeShiftDto } from './dto/create-employee-shift.dto';

import { AuthGuard } from '../auth/guards/auth.guard';
import { EmployeeShiftManagementService } from './employee-shift-management.service';
import { DeleteEmployeeShiftDto } from './dto/delete-employee-shift.dto';
import { UpdateEmployeeShiftDto } from './dto/update-employee-shift.dto';

@Controller('employee-shift-management')
export class EmployeeShiftManagementController {
  constructor(
    private readonly employeeShiftManagementService: EmployeeShiftManagementService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createEmployeeShift(
    @Body() dto: CreateEmployeeShiftDto,
  ): Promise<ISuccess> {
    return this.employeeShiftManagementService.createEmployeeShiftByPersonalNumber(
      dto,
    );
  }

  @Put()
  @UseGuards(AuthGuard)
  async updateEmployeeShift(
    @Body() dto: UpdateEmployeeShiftDto,
  ): Promise<ISuccess> {
    return this.employeeShiftManagementService.updateEmployeeShift(dto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteEmployeeShift(
    @Body() dto: DeleteEmployeeShiftDto,
  ): Promise<ISuccess> {
    return this.employeeShiftManagementService.deleteEmployeeShift(dto);
  }
}
