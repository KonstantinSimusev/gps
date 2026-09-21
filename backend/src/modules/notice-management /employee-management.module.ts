import { Module } from '@nestjs/common';

import { AccountModule } from '../account/account.module';
import { EmployeeModule } from '../employee/employee.module';
import { GradeModule } from '../grade/grade.module';
import { PositionModule } from '../position/position.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { TeamModule } from '../team/team.module';

import { EmployeeManagementController } from './employee-management.controller';
import { EmployeeManagementService } from './employee-management.service';

@Module({
  imports: [
    AccountModule,
    EmployeeModule,
    GradeModule,
    PositionModule,
    ScheduleModule,
    TeamModule,
  ],
  controllers: [EmployeeManagementController],
  providers: [EmployeeManagementService],
  exports: [],
})
export class EmployeeManagementModule {}
