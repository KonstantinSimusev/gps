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

import { CreateEmployeeDTO } from './dto/create-employee.dto';
import { CreateEmployeesDTO } from './dto/create-employees.dto';
import { SearchEmployeeDTO } from './dto/search-employee.dto';
import { UpdateEmployeeDTO } from './dto/update-employee.dto';
import { EmployeeIdDTO } from './dto/employee-id.dto';

import { AuthGuard } from '../auth/guards/auth.guard';
import { EmployeesService } from './employees.service';

import {
  IList,
  IProfile,
  IAccountInfo,
  IEmployeeInfo,
  ISuccess,
} from '../../shared/interfaces/api.interface';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() dto: CreateEmployeeDTO,
    @Req() req: Request & { profile: IProfile },
  ) {
    return this.employeesService.create(dto, req.profile.workshopCode);
  }

  @Post('many')
  async createMany(
    @Body() dtos: CreateEmployeesDTO,
  ): Promise<IList<IAccountInfo>> {
    return this.employeesService.createMany(dtos);
  }

  @Get(':personalNumber')
  @UseGuards(AuthGuard)
  async getEmployeeInfo(
    @Param() dto: SearchEmployeeDTO,
  ): Promise<IEmployeeInfo> {
    return this.employeesService.getEmployeeInfo(dto.personalNumber);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateEmployee(
    @Param() idDto: EmployeeIdDTO,
    @Body() dto: UpdateEmployeeDTO,
    @Req() req: Request & { profile: IProfile },
  ): Promise<IEmployeeInfo> {
    return this.employeesService.updateEmployee(
      idDto.id,
      dto,
      req.profile.workshopCode,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteEmployee(
    @Param() dto: EmployeeIdDTO,
    @Req() req: Request & { profile: IProfile },
  ): Promise<ISuccess> {
    return this.employeesService.deleteEmployee(
      dto.id,
      req.profile.workshopCode,
    );
  }
}
