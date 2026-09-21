import { Injectable, NotFoundException } from '@nestjs/common';

import { Position } from './entities/position.entity';
import { PositionRepository } from './position.repository';

@Injectable()
export class PositionService {
  constructor(private readonly positionRepository: PositionRepository) {}

  async getPosition(
    positionCode: number,
    gradeId: string,
    scheduleId: string,
  ): Promise<Position> {
    const position = await this.positionRepository.findByCodeScheduleAndGrade(
      positionCode,
      gradeId,
      scheduleId,
    );

    if (position === null) {
      throw new NotFoundException('Штатная позиция не найдена');
    }

    return position;
  }
}
