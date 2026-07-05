import * as path from 'node:path';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { GlobalAuthModule } from './global/global-auth.module';

import { EmployeeManagementModule } from './modules/employee-management/employee-management.module';
import { EmployeeAccountModule } from './modules/employee-account/employee-account.module';
import { ShiftManagementModule } from './modules/shift-management/shift-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    GlobalAuthModule,
    EmployeeManagementModule,
    EmployeeAccountModule,
    ShiftManagementModule,
    ServeStaticModule.forRoot(
      {
        rootPath: path.join(__dirname, '..', 'dist', 'assets'),
      },
      {
        rootPath: path.join(__dirname, 'public'),
        serveStaticOptions: {
          index: false,
        },
      },
    ),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
