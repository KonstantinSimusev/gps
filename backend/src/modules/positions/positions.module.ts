import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Position } from './entities/position.entity';
import { PositionsRepository } from './positions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Position])],
  controllers: [],
  providers: [PositionsRepository],
  exports: [PositionsRepository],
})
export class PositionsModule {}
