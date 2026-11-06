import { Injectable, NotFoundException } from '@nestjs/common';

import { Workplace } from './entities/work-place.entity';
import { WorkplaceRepository } from './work-place.repository';

@Injectable()
export class WorkplaceService {
  constructor(private readonly workplaceRepository: WorkplaceRepository) {}

  async getWorkplace(
    name: string,
    workshopCode: string,
    professionCode: string,
  ): Promise<Workplace> {
    const workplace =
      await this.workplaceRepository.findByNameWorkshopAndProfession(
        name,
        workshopCode,
        professionCode,
      );

    if (workplace === null) {
      throw new NotFoundException('Рабочее место не найдено');
    }

    return workplace;
  }
}
