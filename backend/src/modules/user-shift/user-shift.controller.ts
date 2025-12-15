import { Body, Controller, Delete, Post, Put, Req, Res } from '@nestjs/common';

import { Response, Request } from 'express';

import { UserShiftService } from './user-shift.service';

import { AddUserShiftDTO } from './dto/add-user-shift.dto';
import { UpdateUserShiftDTO } from './dto/update-user-shift.dto';
import { DeleteUserShiftDTO } from './dto/delete-user-shift.dto';

import { ISuccess, IUserShift } from '../../shared/interfaces/api.interface';

@Controller('users-shifts')
export class UserShiftController {
  constructor(private readonly userShiftService: UserShiftService) {}

  @Post('create-user-shift')
  async createUserShift(
    @Body() dto: AddUserShiftDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserShift> {
    return this.userShiftService.creatUserShift(dto, req, res);
  }

  @Put('update-user-shift')
  async updateUserShift(
    @Body() dto: UpdateUserShiftDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ISuccess> {
    return this.userShiftService.updateUserShift(dto, req, res);
  }

  @Delete('delete-user-shift')
  async deleteUserShift(
    @Body() dto: DeleteUserShiftDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ISuccess> {
    return this.userShiftService.deleteUserShift(dto.id, req, res);
  }
}
