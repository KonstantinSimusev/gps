import { Module } from '@nestjs/common';

import { EmployeesModule } from '../employees/employees.module';
import { PositionsModule } from '../positions/positions.module';
import { RolesModule } from '../roles/roles.module';
import { EmployeeRolesModule } from '../employee-roles/employee-roles.module';
import { WorkshopsModule } from '../workshops/workshops.module';
import { AccountsModule } from '../accounts/accounts.module';

import { EmployeeManagementController } from './employee-management.controller';
import { EmployeeManagementService } from './employee-management.service';
import { TeamsModule } from '../teams/teams.module';

@Module({
  imports: [
    EmployeesModule,
    TeamsModule,
    PositionsModule,
    RolesModule,
    EmployeeRolesModule,
    WorkshopsModule,
    AccountsModule,
  ],
  controllers: [EmployeeManagementController],
  providers: [EmployeeManagementService],
  exports: [],
})
export class EmployeeManagementModule {}
