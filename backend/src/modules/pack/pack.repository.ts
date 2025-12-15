import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pack } from './entities/pack.entity';

@Injectable()
export class PackRepository {
  constructor(
    @InjectRepository(Pack)
    private readonly packRepository: Repository<Pack>,
  ) {}

  async create(pack: Pack): Promise<Pack> {
    const newPack = this.packRepository.create(pack);
    return await this.packRepository.save(newPack);
  }

  async findById(id: string): Promise<Pack> {
    return await this.packRepository.findOneBy({ id });
  }

  async update(pack: Pack, updateData: Partial<Pack>): Promise<Pack> {
    return await this.packRepository.save({
      ...pack,
      ...updateData,
    });
  }

  async findPacksByShiftId(shiftId: string): Promise<Pack[]> {
    return this.packRepository.find({
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
