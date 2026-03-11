import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AccountsModule } from '../account/account.module';
import { EmployeesModule } from '../employees/employees.module';
import { EmployeeRolesModule } from '../employee-roles/employee-roles.module';
import { RolesModule } from '../roles/roles.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    AccountsModule,
    EmployeesModule,
    RolesModule,
    EmployeeRolesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
