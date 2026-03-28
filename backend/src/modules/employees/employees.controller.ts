import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateEmployeeDTO } from './dto/create-employee.dto';
import { CreateEmployeesDTO } from './dto/create-employees.dto';

import { AuthGuard } from '../auth/guards/auth.guard';
import { EmployeesService } from './employees.service';

import {
  IList,
  IProfile,
  IAccountInfo,
  IEmployeeInfo,
} from '../../shared/interfaces/api.interface';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  // @UseGuards(AuthGuard)
  async create(@Body() dto: CreateEmployeeDTO): Promise<IAccountInfo> {
    return this.employeesService.create(dto);
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
    @Param('personalNumber') personalNumber: string,
  ): Promise<IEmployeeInfo> {
    return this.employeesService.getEmployeeInfo(personalNumber);
  }

  // @Put(':id')
  // async updateUser(
  //   @Param('id') id: string,
  //   @Body() dto: UpdateUserDTO,
  // ): Promise<ISuccess> {
  //   return this.userService.updateUser(id, dto);
  // }

  // @Delete(':id')
  // async deleteUser(@Param('id') id: string): Promise<ISuccess> {
  //   return this.personService.deleteUser(id);
  // }
}
