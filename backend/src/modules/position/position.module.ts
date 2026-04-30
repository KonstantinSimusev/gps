import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Position } from './entities/position.entity';
import { PositionRepository } from './position.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Position])],
  controllers: [],
  providers: [PositionRepository],
  exports: [PositionRepository],
})
export class PositionModule {}
