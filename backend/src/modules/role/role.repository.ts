import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from './entities/role.entity';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // 2. CRUD: Read (общие методы поиска)
  async findByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOneBy({ name });
  }
}
