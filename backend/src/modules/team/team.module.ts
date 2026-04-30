import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Team } from './entities/team.entity';
import { TeamRepository } from './team.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Team])],
  controllers: [],
  providers: [TeamRepository],
  exports: [TeamRepository],
})
export class TeamModule {}
