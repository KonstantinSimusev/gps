import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ShiftSchedule } from './entities/shift-schedule.entity';
import { ShiftScheduleRepository } from './shift-schedule.repository';
import { ShiftScheduleService } from './shift-schedule.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShiftSchedule])],
  controllers: [],
  providers: [ShiftScheduleRepository, ShiftScheduleService],
  exports: [ShiftScheduleRepository, ShiftScheduleService],
})
export class ShiftScheduleModule {}
