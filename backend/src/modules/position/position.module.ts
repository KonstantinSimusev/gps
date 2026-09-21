import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Position } from './entities/position.entity';
import { PositionRepository } from './position.repository';
import { PositionService } from './position.service';

@Module({
  imports: [TypeOrmModule.forFeature([Position])],
  controllers: [],
  providers: [PositionRepository, PositionService],
  exports: [PositionRepository, PositionService],
})
export class PositionModule {}
