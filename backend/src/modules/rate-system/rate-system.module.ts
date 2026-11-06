import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RateSystem } from './entities/rate-system.entity';
import { RateSystemRepository } from './rate-system.repository';
import { RateSystemService } from './rate-system.service';

@Module({
  imports: [TypeOrmModule.forFeature([RateSystem])],
  controllers: [],
  providers: [RateSystemRepository, RateSystemService],
  exports: [RateSystemService],
})
export class RateSystemModule {}
