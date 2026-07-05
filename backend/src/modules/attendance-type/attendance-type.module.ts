import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttendanceType } from './entities/attendance-type.entity';
import { AttendanceTypeRepository } from './attendance-type.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceType])],
  controllers: [],
  providers: [AttendanceTypeRepository],
  exports: [AttendanceTypeRepository],
})
export class AttendanceTypeModule {}
