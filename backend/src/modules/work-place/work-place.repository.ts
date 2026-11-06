import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Workplace } from './entities/work-place.entity';

@Injectable()
export class WorkplaceRepository {
  constructor(
    @InjectRepository(Workplace)
    private readonly workplaceRepository: Repository<Workplace>,
  ) {}

  // 2. CRUD: Read (общие методы поиска)
  async findByNameWorkshopAndProfession(
    name: string,
    workshopCode: string,
    professionCode: string,
  ): Promise<Workplace | null> {
    return this.workplaceRepository.findOne({
      where: {
        name,
        workshop: { workshopCode },
        profession: { professionCode },
      },
    });
  }
}
