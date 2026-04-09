import { Module } from '@nestjs/common';

import { EmployeesModule } from '../employees/employees.module';
import { AccountsModule } from '../accounts/accounts.module';
import { WorkshopsModule } from '../workshops/workshops.module';

import { EmployeeAccountController } from './employee-account.controller';
import { EmployeeAccountService } from './employee-account.service';

@Module({
  imports: [EmployeesModule, AccountsModule, WorkshopsModule],
  controllers: [EmployeeAccountController],
  providers: [EmployeeAccountService],
})
export class EmployeeAccountModule {}
