import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { Request } from 'express';

import { AuthGuard } from '../auth/guards/auth.guard';

import { CreateShiftDto } from './dto/create-shift.dto';
import { IProfile, ISuccess } from '../../shared/interfaces/api.interface';

import { ShiftManagementService } from './shift-management.service';

@Controller('shift-management')
export class ShiftManagementController {
  constructor(
    private readonly shiftManagementService: ShiftManagementService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createShift(
    @Req() req: Request & { profile: IProfile },
  ): Promise<ISuccess> {
    return this.shiftManagementService.createShift(req.profile);
  }
}
