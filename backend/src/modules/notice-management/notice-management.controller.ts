import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { Request } from 'express';

import { AuthGuard } from '../auth/guards/auth.guard';

import {
  INotice,
  IProfile,
  ISuccess,
} from '../../shared/interfaces/api.interface';

import { NoticeManagementService } from './notice-management.service';

@Controller('notice-management')
export class NoticeManagementController {
  constructor(
    private readonly noticeManagementService: NoticeManagementService,
  ) {}

  // @Post('missing-shifts')
  // @UseGuards(AuthGuard)
  // async createMissingShiftNotices(
  //   @Req() req: Request & { profile: IProfile },
  // ): Promise<ISuccess> {
  //   return this.noticeManagementService.createMissingShiftNotices(req.profile);
  // }

  @Post('pending-shifts')
  @UseGuards(AuthGuard)
  async createPendingShiftNotices(
    @Req() req: Request & { profile: IProfile },
  ): Promise<ISuccess> {
    return this.noticeManagementService.createPendingShiftNotices(req.profile);
  }

  @Get('notices')
  @UseGuards(AuthGuard)
  async getNotices(
    @Req() req: Request & { profile: IProfile },
  ): Promise<INotice[]> {
    return this.noticeManagementService.getNotices(req.profile);
  }
}
