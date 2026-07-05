import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeShift } from './entities/employee-shift.entity';
import { EmployeeShiftRepository } from './employee-shift.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeShift])],
  controllers: [],
  providers: [EmployeeShiftRepository],
  exports: [EmployeeShiftRepository],
})
export class EmployeeShiftModule {}
