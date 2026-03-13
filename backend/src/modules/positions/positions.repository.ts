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

  async findPositionByCode(code: string): Promise<Position> {
    return this.positionsRepository.findOne({
      where: { positionCode: code },
    });
  }
}
