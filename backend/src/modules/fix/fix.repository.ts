import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Fix } from './entities/fix.entity';

@Injectable()
export class FixRepository {
  constructor(
    @InjectRepository(Fix)
    private readonly fixRepository: Repository<Fix>,
  ) {}

  async create(fix: Fix): Promise<Fix> {
    const newFix = this.fixRepository.create(fix);
    return await this.fixRepository.save(newFix);
  }

  async findById(id: string): Promise<Fix> {
    return await this.fixRepository.findOneBy({ id });
  }

  async update(
    fix: Fix,
    updateData: Partial<Fix>,
  ): Promise<Fix> {
    return await this.fixRepository.save({
      ...fix,
      ...updateData,
    });
  }

  async findFixsByShiftId(shiftId: string): Promise<Fix[]> {
    return this.fixRepository.find({
      where: {
        shift: {
          id: shiftId,
        },
      },
      order: {
        sortOrder: 'ASC', // сортировка по возрастанию (1, 2, 3, ...)
      },
    });
  }
}
