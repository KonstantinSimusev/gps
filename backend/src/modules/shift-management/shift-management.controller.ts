import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';

import { Request } from 'express';

import { AuthGuard } from '../auth/guards/auth.guard';

import {
  IProfile,
  IShift,
  ISuccess,
} from '../../shared/interfaces/api.interface';

import { ShiftDateDto } from './dto/shift-date.dto';
import { ShiftIdDto } from './dto/shift-id.dto';

import { ShiftManagementService } from './shift-management.service';

@Controller('shift-management')
export class ShiftManagementController {
  constructor(
    private readonly shiftManagementService: ShiftManagementService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createShifts(
    @Req() req: Request & { profile: IProfile },
  ): Promise<ISuccess> {
    return this.shiftManagementService.createShifts(req.profile);
  }

  @Get('shifts')
  @UseGuards(AuthGuard)
  async getShifts(
    @Req() req: Request & { profile: IProfile },
  ): Promise<IShift[]> {
    return this.shiftManagementService.getShifts(req.profile);
  }

  @Get('shifts/:shiftDate')
  @UseGuards(AuthGuard)
  async getShiftsByDate(
    @Param() dto: ShiftDateDto,
    @Req() req: Request & { profile: IProfile },
  ): Promise<IShift[]> {
    return this.shiftManagementService.getShiftsByDay(dto, req.profile);
  }

  @Get('shift/:id')
  @UseGuards(AuthGuard)
  async getShiftById(@Param() dto: ShiftIdDto): Promise<IShift> {
    return this.shiftManagementService.getShiftById(dto);
  }

  // @Post('check-missing-shifts')
  // @UseGuards(AuthGuard)
  // async checkMissingShifts(
  //   @Req() req: Request & { profile: IProfile },
  // ): Promise<ISuccess> {
  //   return this.shiftManagementService.checkMissingShifts(req.profile);
  // }

  // @Post('check-pending-shifts')
  // @UseGuards(AuthGuard)
  // async checkPendingShifts(
  //   @Req() req: Request & { profile: IProfile },
  // ): Promise<ISuccess> {
  //   return this.shiftManagementService.checkPendingShifts(req.profile);
  // }

  // @Get('unchecked-shifts')
  // @UseGuards(AuthGuard)
  // async getUncheckedShifts(
  //   @Req() req: Request & { profile: IProfile },
  // ): Promise<IShift[]> {
  //   return this.shiftManagementService.getUncheckedShifts(req.profile);
  // }

  // @Post('missing-shifts')
  // @UseGuards(AuthGuard)
  // async createMissingShifts(
  //   @Req() req: Request & { profile: IProfile },
  // ): Promise<ISuccess> {
  //   return this.shiftManagementService.createMissingShifts(req.profile);
  // }
}
