import { Repository, UpdateResult } from 'typeorm';
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

  async update(employeeId: string, roleId: string): Promise<void> {
    await this.employeeRolesRepository.update(
      { employee: { id: employeeId } }, // ищем запись по ID сотрудника
      { role: { id: roleId } }, // обновляем связь на новую роль
    );
  }

  async deleteByEmployeeId(employeeId: string): Promise<void> {
    await this.employeeRolesRepository.delete({
      employee: {
        id: employeeId,
      },
    });
  }

  async findEmployeeRoleByAccount(
    accountId: string,
  ): Promise<{ id: string; name: string } | null> {
    return await this.employeeRolesRepository
      .createQueryBuilder('employeeRole')
      .innerJoin('employeeRole.employee', 'employee') // Связываем роль с сотрудником
      .innerJoin('employee.account', 'account') // Связываем сотрудника с аккаунтом
      .where('account.id = :accountId', { accountId }) // Фильтруем по ID аккаунта
      .andWhere('employee.isActive = true') // Проверяем активность сотрудника
      .innerJoin('employeeRole.role', 'role') // Связываем роль сотрудника с ролью
      .select('role.name', 'name') // Выбираем имя роли
      .addSelect('employeeRole.id', 'id') // Выбираем ID роли сотрудника
      .getRawOne();
  }

  async findEmployeeRoleByEmployee(
    employeeId: string,
  ): Promise<{ id: string; name: string } | null> {
    return await this.employeeRolesRepository
      .createQueryBuilder('employeeRole')
      .innerJoin('employeeRole.employee', 'employee')
      .where('employee.id = :employeeId', { employeeId })
      // .andWhere('employee.isActive = true')
      .innerJoin('employeeRole.role', 'role')
      .select('role.name', 'name')
      .addSelect('employeeRole.id', 'id')
      .getRawOne();
  }

  // async findAll(): Promise<Employee[]> {
  //   return this.employeesRepository.find({});
  // }

  // async findOne(id: string): Promise<EmployeeRole | null> {
  //   return this.employeeRolesRepository.findOne({ where: { id } });
  // }

  // async findById(id: string): Promise<Employee> {
  //   return this.employeesRepository.findOneBy({ id });
  // }

  // async remove(id: string): Promise<void> {
  //   this.employeesRepository.delete(id);
  // }
}
