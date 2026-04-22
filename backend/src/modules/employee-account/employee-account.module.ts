import { Module } from '@nestjs/common';

import { AccountsModule } from '../accounts/accounts.module';
import { EmployeesModule } from '../employees/employees.module';
import { WorkshopsModule } from '../workshops/workshops.module';

import { EmployeeAccountController } from './employee-account.controller';
import { EmployeeAccountService } from './employee-account.service';

@Module({
  imports: [AccountsModule, EmployeesModule, WorkshopsModule],
  controllers: [EmployeeAccountController],
  providers: [EmployeeAccountService],
  exports: []
})
export class EmployeeAccountModule {}
