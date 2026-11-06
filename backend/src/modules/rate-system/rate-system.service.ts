import { Injectable, NotFoundException } from '@nestjs/common';

import { RateSystem } from './entities/rate-system.entity';
import { RateSystemRepository } from './rate-system.repository';

@Injectable()
export class RateSystemService {
  constructor(private readonly rateSystemRepository: RateSystemRepository) {}

  async getRateSystem(code: string): Promise<RateSystem> {
    const rateSystem = await this.rateSystemRepository.findByCode(code);

    if (!rateSystem) {
      throw new NotFoundException(`ИСО ${code} не найдена в базе данных`);
    }

    return rateSystem;
  }
}
