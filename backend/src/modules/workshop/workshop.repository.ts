import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Workshop } from './entities/workshop.entity';

@Injectable()
export class WorkshopRepository {
  constructor(
    @InjectRepository(Workshop)
    private readonly workshopRepository: Repository<Workshop>,
  ) {}

  // 2. CRUD: Read (общие методы поиска)
  async findWorkshopByCode(workshopCode: string): Promise<Workshop | null> {
    return this.workshopRepository.findOneBy({ workshopCode });
  }
}
