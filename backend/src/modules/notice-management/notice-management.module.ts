import { Module } from '@nestjs/common';

import { NoticeModule } from '../notice/notice.module';
import { NoticeTitleModule } from '../notice-title/notice-title.module';
import { ShiftManagementModule } from '../shift-management/shift-management.module';

import { NoticeManagementController } from './notice-management.controller';
import { NoticeManagementService } from './notice-management.service';
import { ScheduleModule } from '../schedule/schedule.module';
import { TeamModule } from '../team/team.module';
import { WorkshopModule } from '../workshop/workshop.module';

@Module({
  imports: [
    NoticeModule,
    NoticeTitleModule,
    ScheduleModule,
    ShiftManagementModule,
    TeamModule,
    WorkshopModule,
  ],
  controllers: [NoticeManagementController],
  providers: [NoticeManagementService],
  exports: [NoticeManagementService],
})
export class NoticeManagementModule {}
