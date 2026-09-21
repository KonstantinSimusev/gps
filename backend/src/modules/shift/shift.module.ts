import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Shift } from './entities/shift.entity';
import { ShiftController } from './shift.controller';
import { ShiftService } from './shift.service';
import { ShiftRepository } from './shift.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Shift])],
  controllers: [ShiftController],
  providers: [ShiftRepository, ShiftService],
  exports: [ShiftRepository, ShiftService],
})
export class ShiftModule {}
