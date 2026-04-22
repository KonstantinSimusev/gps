import { Module } from '@nestjs/common';

import { AccountsModule } from '../accounts/accounts.module';
import { EmployeeRolesModule } from '../employee-roles/employee-roles.module';
import { EmployeesModule } from '../employees/employees.module';
import { PositionsModule } from '../positions/positions.module';
import { RolesModule } from '../roles/roles.module';
import { TeamsModule } from '../teams/teams.module';
import { WorkshopsModule } from '../workshops/workshops.module';

import { EmployeeManagementController } from './employee-management.controller';
import { EmployeeManagementService } from './employee-management.service';

@Module({
  imports: [
    AccountsModule,
    EmployeeRolesModule,
    EmployeesModule,
    PositionsModule,
    RolesModule,
    TeamsModule,
    WorkshopsModule,
  ],
  controllers: [EmployeeManagementController],
  providers: [EmployeeManagementService],
  exports: [],
})
export class EmployeeManagementModule {}
