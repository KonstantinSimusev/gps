import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Position } from './entities/position.entity';

@Injectable()
export class PositionRepository {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  // 2. CRUD: Read (общие методы поиска)
  async findByCodeScheduleAndGrade(
    positionCode: number,
    gradeId: string,
    scheduleId: string,
  ): Promise<Position | null> {
    return this.positionRepository.findOne({
      where: {
        positionCode,
        grade: { id: gradeId },
        schedule: { id: scheduleId },
      },
      relations: ['workshop', 'grade', 'schedule', 'role'],
    });
  }
}
