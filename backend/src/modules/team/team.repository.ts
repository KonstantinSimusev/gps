import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Team } from './entities/team.entity';

@Injectable()
export class TeamRepository {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  // 2. CRUD: Read (общие методы поиска)
  async findTeamByTeamNumber(teamNumber: string): Promise<Team> {
    return this.teamRepository.findOne({
      where: { teamNumber },
    });
  }
}
