import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Team } from './entities/team.entity';
import { TeamRepository } from './team.repository';
import { TeamService } from './team.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team])],
  controllers: [],
  providers: [TeamRepository, TeamService],
  exports: [TeamRepository, TeamService],
})
export class TeamModule {}
