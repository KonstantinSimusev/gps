import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ShiftSchedule } from './entities/shift-schedule.entity';
import { ShiftScheduleRepository } from './shift-schedule.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ShiftSchedule])],
  controllers: [],
  providers: [ShiftScheduleRepository],
  exports: [ShiftScheduleRepository],
})
export class ShiftScheduleModule {}
