import { Module } from '@nestjs/common';

import { AttendanceTypeModule } from '../attendance-type/attendance-type.module';
import { EmployeeModule } from '../employee/employee.module';
import { EmployeeShiftModule } from '../employee-shift/employee-shift.module';
import { ShiftModule } from '../shift/shift.module';
import { ShiftScheduleModule } from '../shift-schedule/shift-schedule.module';
import { TeamModule } from '../team/team.module';
import { WorkshopModule } from '../workshop/workshop.module';

import { ShiftManagementController } from './shift-management.controller';
import { ShiftManagementService } from './shift-management.service';

@Module({
  imports: [
    AttendanceTypeModule,
    EmployeeModule,
    EmployeeShiftModule,
    ShiftModule,
    ShiftScheduleModule,
    TeamModule,
    WorkshopModule,
  ],
  controllers: [ShiftManagementController],
  providers: [ShiftManagementService],
  exports: [],
})
export class ShiftManagementModule {}
