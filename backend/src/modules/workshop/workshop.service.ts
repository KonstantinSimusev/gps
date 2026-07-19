import { Injectable, NotFoundException } from '@nestjs/common';

import { Workshop } from './entities/workshop.entity';
import { WorkshopRepository } from './workshop.repository';

@Injectable()
export class WorkshopService {
  constructor(private readonly workshopRepository: WorkshopRepository) {}

  async getWorkshop(workshopCode: string): Promise<Workshop> {
    const workshop =
      await this.workshopRepository.findWorkshopByCode(workshopCode);

    if (!workshop) {
      throw new NotFoundException(`Цех ${workshopCode} не найден`);
    }

    return workshop;
  }
}
