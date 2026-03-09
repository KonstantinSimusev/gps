import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AccountsModule } from '../account/account.module';
import { EmployeesModule } from '../employees/employees.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [ConfigModule, JwtModule, AccountsModule, EmployeesModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
