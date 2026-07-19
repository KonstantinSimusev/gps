import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttendanceType } from './entities/attendance-type.entity';
import { AttendanceTypeRepository } from './attendance-type.repository';
import { AttendanceTypeService } from './attendance-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceType])],
  controllers: [],
  providers: [AttendanceTypeRepository, AttendanceTypeService],
  exports: [AttendanceTypeRepository, AttendanceTypeService],
})
export class AttendanceTypeModule {}
