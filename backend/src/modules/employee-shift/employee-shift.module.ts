import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeShift } from './entities/employee-shift.entity';

import { EmployeeShiftController } from './employee-shift.controller';
import { EmployeeShiftService } from './employee-shift.service';
import { EmployeeShiftRepository } from './employee-shift.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeShift])],
  controllers: [EmployeeShiftController],
  providers: [EmployeeShiftRepository, EmployeeShiftService],
  exports: [EmployeeShiftRepository, EmployeeShiftService],
})
export class EmployeeShiftModule {}
