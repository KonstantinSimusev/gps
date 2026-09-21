import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Notice } from './entities/notice.entity';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { NoticeRepository } from './notice.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Notice])],
  controllers: [NoticeController],
  providers: [NoticeRepository, NoticeService],
  exports: [NoticeRepository, NoticeService],
})
export class NoticeModule {}
