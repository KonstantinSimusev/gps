import { Module } from '@nestjs/common';

import { AttendanceTypeModule } from '../attendance-type/attendance-type.module';
import { EmployeeModule } from '../employee/employee.module';
import { EmployeeShiftModule } from '../employee-shift/employee-shift.module';
import { ShiftModule } from '../shift/shift.module';
import { ShiftScheduleModule } from '../shift-schedule/shift-schedule.module';
import { WorkplaceModule } from '../work-place/work-place.module';

import { EmployeeShiftManagementController } from './employee-shift-management.controller';
import { EmployeeShiftManagementService } from './employee-shift-management.service';

@Module({
  imports: [
    AttendanceTypeModule,
    EmployeeModule,
    EmployeeShiftModule,
    ShiftModule,
    ShiftScheduleModule,
    WorkplaceModule,
  ],
  controllers: [EmployeeShiftManagementController],
  providers: [EmployeeShiftManagementService],
  exports: [EmployeeShiftManagementService],
})
export class EmployeeShiftManagementModule {}
