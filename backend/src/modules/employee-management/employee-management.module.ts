import { Module } from '@nestjs/common';

import { AccountModule } from '../account/account.module';
import { EmployeeModule } from '../employee/employee.module';
import { EmployeeRoleModule } from '../employee-role/employee-role.module';
import { PositionModule } from '../position/position.module';
import { RoleModule } from '../role/role.module';
import { TeamModule } from '../team/team.module';

import { EmployeeManagementController } from './employee-management.controller';
import { EmployeeManagementService } from './employee-management.service';

@Module({
  imports: [
    AccountModule,
    EmployeeModule,
    EmployeeRoleModule,
    PositionModule,
    RoleModule,
    TeamModule,
  ],
  controllers: [EmployeeManagementController],
  providers: [EmployeeManagementService],
  exports: [],
})
export class EmployeeManagementModule {}
