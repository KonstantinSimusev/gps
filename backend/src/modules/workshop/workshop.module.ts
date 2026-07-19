import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Workshop } from './entities/workshop.entity';
import { WorkshopRepository } from './workshop.repository';
import { WorkshopService } from './workshop.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workshop])],
  controllers: [],
  providers: [WorkshopRepository, WorkshopService],
  exports: [WorkshopRepository, WorkshopService],
})
export class WorkshopModule {}
