import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateEmployeesDto } from './dto/create-employees.dto';
import { SearchEmployeeDto } from './dto/search-employee.dto';
import { EmployeeIdDto } from './dto/employee-id.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeManagementService } from './employee-management.service';

import {
  IList,
  IProfile,
  IAccountInfo,
  IEmployeeInfo,
  ISuccess,
} from '../../shared/interfaces/api.interface';

@Controller('employee-management')
export class EmployeeManagementController {
  constructor(
    private readonly employeeManagementService: EmployeeManagementService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createEmployee(
    @Body() dto: CreateEmployeeDto,
    @Req() req: Request & { profile: IProfile },
  ) {
    return this.employeeManagementService.createEmployee(
      dto,
      req.profile.workshopCode,
    );
  }

  @Post('many')
  async createMany(
    @Body() dtos: CreateEmployeesDto,
  ): Promise<IList<IAccountInfo>> {
    return this.employeeManagementService.createMany(dtos);
  }

  @Get(':personalNumber')
  @UseGuards(AuthGuard)
  async getEmployeeInfo(
    @Param() dto: SearchEmployeeDto,
  ): Promise<IEmployeeInfo> {
    return this.employeeManagementService.getEmployeeInfo(dto.personalNumber);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateEmployee(
    @Param() idDto: EmployeeIdDto,
    @Body() dto: UpdateEmployeeDto,
    @Req() req: Request & { profile: IProfile },
  ): Promise<IEmployeeInfo> {
    return this.employeeManagementService.updateEmployee(
      idDto.id,
      dto,
      req.profile.workshopCode,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteEmployee(
    @Param() dto: EmployeeIdDto,
    @Req() req: Request & { profile: IProfile },
  ): Promise<ISuccess> {
    return this.employeeManagementService.deleteEmployee(
      dto.id,
      req.profile.workshopCode,
    );
  }
}
