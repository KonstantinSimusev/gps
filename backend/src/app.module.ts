import * as path from 'node:path';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ShiftModule } from './modules/shift/shift.module';
import { UserShiftModule } from './modules/user-shift/user-shift.module';
import { ProductionModule } from './modules/production/production.module';
import { ShipmentModule } from './modules/shipment/shipment.module';
import { PackModule } from './modules/pack/pack.module';
import { FixModule } from './modules/fix/fix.module';
import { ResidueModule } from './modules/residue/residue.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ShiftModule,
    UserShiftModule,
    ProductionModule,
    ShipmentModule,
    PackModule,
    FixModule,
    ResidueModule,
    ReportModule,
    // Первый статический модуль
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'dist', 'assets'),
    }),
    // Второй статический модуль с особыми настройками
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, 'public'),
      serveStaticOptions: {
        index: false,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
