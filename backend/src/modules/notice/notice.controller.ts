import { Controller, Param, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../auth/guards/auth.guard';

import { NoticeIdDto } from './dto/notice-id.dto';
import { ISuccess } from '../../shared/interfaces/api.interface';

import { NoticeService } from './notice.service';

@Controller('notices')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post(':id/read')
  @UseGuards(AuthGuard)
  async markAsRead(@Param() dto: NoticeIdDto): Promise<ISuccess> {
    return this.noticeService.markAsReadById(dto);
  }
}
