import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Team } from './entities/team.entity';

@Injectable()
export class TeamsRepository {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,
  ) {}

  async findTeamByTeamNumber(teamNumber: string): Promise<Team> {
    return this.teamsRepository.findOne({
      where: { teamNumber },
    });
  }
}
