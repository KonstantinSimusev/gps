import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RateSystem } from './entities/rate-system.entity';

@Injectable()
export class RateSystemRepository {
  constructor(
    @InjectRepository(RateSystem)
    private readonly rateSystemRepository: Repository<RateSystem>,
  ) {}

  async findByCode(rateCode: string): Promise<RateSystem | null> {
    return this.rateSystemRepository.findOne({
      where: { rateCode },
    });
  }
}
