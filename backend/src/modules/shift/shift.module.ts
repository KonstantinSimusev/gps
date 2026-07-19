import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Shift } from './entities/shift.entity';
import { ShiftRepository } from './shift.repository';
import { ShiftService } from './shift.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shift])],
  controllers: [],
  providers: [ShiftRepository, ShiftService],
  exports: [ShiftRepository, ShiftService],
})
export class ShiftModule {}
