import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Schedule } from './entities/schedule.entity';
import { ScheduleRepository } from './schedule.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule])],
  controllers: [],
  providers: [ScheduleRepository],
  exports: [ScheduleRepository],
})
export class ScheduleModule {}
