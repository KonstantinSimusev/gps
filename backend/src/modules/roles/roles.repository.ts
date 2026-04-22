import { DeleteResult, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from './entities/role.entity';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async findOne(id: string): Promise<Role | null> {
    return this.rolesRepository.findOne({ where: { id } });
  }

  async findRoleByName(name: string): Promise<Role | null> {
    return this.rolesRepository.findOneBy({ name });
  }

  async findRoleByPositionCode(
    positionCode: string,
  ): Promise<{ id: string } | null> {
    return await this.rolesRepository
      .createQueryBuilder('role')
      .innerJoin('role.positions', 'position')
      .select('role.id', 'id')
      .where('position.positionCode = :positionCode', { positionCode })
      .getRawOne();
  }
}
