import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CreateEmployeeDTO } from './dto/create-employee.dto';
import { CreateEmployeesDTO } from './dto/create-employees.dto';

import { AuthGuard } from '../auth/guards/auth.guard';
import { EmployeesService } from './employees.service';

import {
  IList,
  IEmployee,
  IAccountAPI,
} from '../../shared/interfaces/api.interface';


@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() dto: CreateEmployeeDTO): Promise<IAccountAPI> {
    return this.employeesService.create(dto);
  }

  @Post('many')
  async createMany(
    @Body() dtos: CreateEmployeesDTO,
  ): Promise<IList<IAccountAPI>> {
    return this.employeesService.createMany(dtos);
  }

  @Get()
  async getByWorkshopAndTeam(): Promise<IList<IEmployee>> {
    return this.employeesService.getByWorkshopAndTeam();
  }

  // @Get('professions')
  // async getProfessions(
  //   @Req() req: Request,
  //   @Res({ passthrough: true }) res: Response,
  // ): Promise<IList<IProfession>> {
  //   return this.userService.getProfessions(req, res);
  // }

  // @Get(':id')
  // async getUser(@Param('id') id: string): Promise<IUser> {
  //   return this.userService.getUser(id);
  // }

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
