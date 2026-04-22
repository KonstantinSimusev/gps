import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Position } from './entities/position.entity';

@Injectable()
export class PositionsRepository {
  constructor(
    @InjectRepository(Position)
    private readonly positionsRepository: Repository<Position>,
  ) {}

  async findOne(id: string): Promise<Position | null> {
    return this.positionsRepository.findOne({
      where: { id },
      relations: [
        'employees',
        'workshop',
        'profession',
        'grade',
        'schedule',
        'role',
      ],
    });
  }

  async findPositionByCode(code: string): Promise<Position | null> {
    return this.positionsRepository.findOne({
      where: { positionCode: code },
    });
  }
}
