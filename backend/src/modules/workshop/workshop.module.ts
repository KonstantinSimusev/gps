import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Workshop } from './entities/workshop.entity';
import { WorkshopRepository } from './workshop.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Workshop])],
  controllers: [],
  providers: [WorkshopRepository],
  exports: [WorkshopRepository],
})
export class WorkshopModule {}
