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
  async findByPositionCode(code: string): Promise<Position | null> {
    return this.positionRepository.findOne({
      where: { positionCode: code },
      relations: ['workshop', 'role'],
    });
  }
}
