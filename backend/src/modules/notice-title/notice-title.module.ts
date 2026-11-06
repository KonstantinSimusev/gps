import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NoticeTitle } from './entities/notice-title.entity';
import { NoticeTitleRepository } from './notice-title.repository';
import { NoticeTitleService } from './notice-title.service';

@Module({
  imports: [TypeOrmModule.forFeature([NoticeTitle])],
  controllers: [],
  providers: [NoticeTitleRepository, NoticeTitleService],
  exports: [NoticeTitleRepository, NoticeTitleService],
})
export class NoticeTitleModule {}
