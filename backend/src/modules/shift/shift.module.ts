import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Shift } from './entities/shift.entity';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { UserShiftModule } from '../user-shift/user-shift.module';
import { ProductionModule } from '../production/production.module';
import { ShipmentModule } from '../shipment/shipment.module';
import { PackModule } from '../pack/pack.module';
import { FixModule } from '../fix/fix.module';
import { ResidueModule } from '../residue/residue.module';

import { ShiftRepository } from './shift.repository';
import { ShiftService } from './shift.service';
import { ShiftController } from './shift.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shift]),
    AuthModule,
    UserModule,
    UserShiftModule,
    ProductionModule,
    ShipmentModule,
    PackModule,
    FixModule,
    ResidueModule,
  ],
  controllers: [ShiftController],
  providers: [ShiftRepository, ShiftService],
  exports: [ShiftRepository, ShiftService],
})
export class ShiftModule {}
