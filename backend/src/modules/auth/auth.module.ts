import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthGuard } from './guards/auth.guard';

import { AccountsModule } from '../accounts/accounts.module';
import { EmployeeRolesModule } from '../employee-roles/employee-roles.module';
import { EmployeesModule } from '../employees/employees.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    AccountsModule,
    EmployeeRolesModule,
    EmployeesModule,
  ],
  controllers: [AuthController],
  providers: [AuthGuard, AuthService],
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
