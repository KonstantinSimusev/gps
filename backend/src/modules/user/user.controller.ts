import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';

import { Response, Request } from 'express';

import { UserService } from './user.service';

import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

import {
  IList,
  IUser,
  ISuccess,
  IShift,
  IProfession,
} from '../../shared/interfaces/api.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDTO): Promise<ISuccess> {
    return this.userService.createUser(dto);
  }

  @Post('all')
  async createUsers(@Body() dto: CreateUserDTO[]): Promise<ISuccess> {
    return this.userService.createUsers(dto);
  }

  @Get()
  async getUsers(): Promise<IList<IUser>> {
    return this.userService.getUsers();
  }

  @Get('professions')
  async getProfessions(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IList<IProfession>> {
    return this.userService.getProfessions(req, res);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<IUser> {
    return this.userService.getUser(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDTO,
  ): Promise<ISuccess> {
    return this.userService.updateUser(id, dto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<ISuccess> {
    return this.userService.deleteUser(id);
  }
}
