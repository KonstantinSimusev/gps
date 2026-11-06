import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Workplace } from './entities/work-place.entity';
import { WorkplaceService } from './work-place.service';
import { WorkplaceRepository } from './work-place.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Workplace])],
  controllers: [],
  providers: [WorkplaceRepository, WorkplaceService],
  exports: [WorkplaceService],
})
export class WorkplaceModule {}
