import { Module } from '@nestjs/common';

import { AccountModule } from '../account/account.module';
import { EmployeeModule } from '../employee/employee.module';

import { EmployeeAccountController } from './employee-account.controller';
import { EmployeeAccountService } from './employee-account.service';

@Module({
  imports: [AccountModule, EmployeeModule],
  controllers: [EmployeeAccountController],
  providers: [EmployeeAccountService],
  exports: [],
})
export class EmployeeAccountModule {}
