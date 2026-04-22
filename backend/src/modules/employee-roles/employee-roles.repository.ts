import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EmployeeRole } from './entities/employee-role.entity';

@Injectable()
export class EmployeeRolesRepository {
  constructor(
    @InjectRepository(EmployeeRole)
    private readonly employeeRolesRepository: Repository<EmployeeRole>,
  ) {}

  async create(employeeId: string, roleId: string): Promise<EmployeeRole> {
    // Создаём новую запись о связи сотрудника с ролью
    const employeeRole = this.employeeRolesRepository.create({
      employee: { id: employeeId },
      role: { id: roleId },
    });

    return this.employeeRolesRepository.save(employeeRole);
  }

  async update(employeeId: string, roleId: string): Promise<UpdateResult> {
    return this.employeeRolesRepository.update(
      { employee: { id: employeeId } }, // ищем запись по ID сотрудника
      { role: { id: roleId } }, // обновляем связь на новую роль
    );
  }

  async removeEmployeeRole(employeeId: string): Promise<DeleteResult> {
    return this.employeeRolesRepository.delete({
      employee: {
        id: employeeId,
      },
    });
  }

  async findEmployeeRoleByAccount(
    accountId: string,
  ): Promise<EmployeeRole | null> {
    return await this.employeeRolesRepository.findOne({
      where: {
        employee: {
          account: { id: accountId },
          isActive: true,
        },
      },
      relations: ['employee', 'role'],
    });
  }

  async findEmployeeRoleByEmployee(
    employeeId: string,
  ): Promise<EmployeeRole | null> {
    return await this.employeeRolesRepository.findOne({
      where: {
        employee: {
          id: employeeId,
          // isActive: true,
        },
      },
      relations: ['employee', 'role'],
    });
  }
}
