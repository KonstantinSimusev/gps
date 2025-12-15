import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Residue } from './entities/residue.entity';

@Injectable()
export class ResidueRepository {
  constructor(
    @InjectRepository(Residue)
    private readonly residueRepository: Repository<Residue>,
  ) {}

  async create(residue: Residue): Promise<Residue> {
    const newResidue = this.residueRepository.create(residue);
    return await this.residueRepository.save(newResidue);
  }

  async findById(id: string): Promise<Residue> {
    return await this.residueRepository.findOneBy({ id });
  }

  async update(
    residue: Residue,
    updateData: Partial<Residue>,
  ): Promise<Residue> {
    return await this.residueRepository.save({
      ...residue,
      ...updateData,
    });
  }

  async findResiduesByShiftId(shiftId: string): Promise<Residue[]> {
    return this.residueRepository.find({
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
