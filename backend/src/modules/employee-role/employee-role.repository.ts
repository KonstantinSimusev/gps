import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EmployeeRole } from './entities/employee-role.entity';

@Injectable()
export class EmployeeRoleRepository {
  constructor(
    @InjectRepository(EmployeeRole)
    private readonly employeeRoleRepository: Repository<EmployeeRole>,
  ) {}

  // 1. CRUD: Create
  async create(employeeId: string, roleId: string): Promise<EmployeeRole> {
    // Создаём новую запись о связи сотрудника с ролью
    const employeeRole = this.employeeRoleRepository.create({
      employee: { id: employeeId },
      role: { id: roleId },
    });

    return this.employeeRoleRepository.save(employeeRole);
  }

  // 3. CRUD: Update
  async save(employeeRole: EmployeeRole): Promise<EmployeeRole> {
    return this.employeeRoleRepository.save(employeeRole);
  }
}
