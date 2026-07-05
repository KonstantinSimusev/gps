import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Shift } from './entities/shift.entity';
import { ShiftRepository } from './shift.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Shift])],
  controllers: [],
  providers: [ShiftRepository],
  exports: [ShiftRepository],
})
export class ShiftModule {}
