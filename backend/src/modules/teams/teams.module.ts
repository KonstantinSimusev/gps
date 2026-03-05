import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Team } from './entities/team.entity';
import { TeamsRepository } from './teams.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Team])],
  controllers: [],
  providers: [TeamsRepository],
  exports: [TeamsRepository],
})
export class TeamsModule {}
