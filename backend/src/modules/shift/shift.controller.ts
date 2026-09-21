import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../auth/guards/auth.guard';

import { ShiftIdDto } from './dto/shift-id.dto';
import { IShift, ISuccess } from '../../shared/interfaces/api.interface';

import { ShiftService } from './shift.service';

@Controller('shifts')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post(':id/check')
  @UseGuards(AuthGuard)
  async setChecked(@Param() dto: ShiftIdDto): Promise<ISuccess> {
    return this.shiftService.setCheckedByShiftId(dto);
  }
}
