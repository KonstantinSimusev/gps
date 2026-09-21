import { Injectable, NotFoundException } from '@nestjs/common';

import { Role } from './entities/role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getRole(name: string): Promise<Role> {
    const role = await this.roleRepository.findByName(name);

    if (role === null) {
      throw new NotFoundException('Роль не найдена');
    }

    return role;
  }
}
