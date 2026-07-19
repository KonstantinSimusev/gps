import { Injectable, NotFoundException } from '@nestjs/common';

import { Team } from './entities/team.entity';
import { TeamRepository } from './team.repository';

@Injectable()
export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  async getTeam(teamNumber: number): Promise<Team> {
    const team = await this.teamRepository.findTeamByTeamNumber(teamNumber);

    if (!team) {
      throw new NotFoundException(`Бригада номер ${teamNumber} не найдена`);
    }

    return team;
  }
}
