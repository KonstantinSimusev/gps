import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EmployeeRole } from './entities/employee-role.entity';

@Injectable()
export class EmployeeRolesRepository {
  constructor(
    @InjectRepository(EmployeeRole)
    private readonly employeeRolesRepository: Repository<EmployeeRole>,
  ) {}

  async findEmployeeRoleByAccount(
    accountId: string,
  ): Promise<{ name: string; isActive: boolean } | null> {
    return await this.employeeRolesRepository // Начинаем с Employee, а не EmployeeRole
      .createQueryBuilder('employeeRole')
      .innerJoin('employeeRole.employee', 'employee') // Связываем роль с сотрудником
      .innerJoin('employee.account', 'account') // Связываем сотрудника с аккаунтом
      .where('account.id = :accountId', { accountId }) // Фильтруем по ID аккаунта
      .andWhere('employee.isActive = true') // Проверяем активность сотрудника
      .innerJoin('employeeRole.role', 'role') // Связываем роль сотрудника с ролью
      .select('role.name', 'name') // Выбираем имя роли
      .addSelect('employeeRole.isActive', 'isActive') // Выбираем статус активности роли
      .getRawOne();
  }

  // async findAll(): Promise<Employee[]> {
  //   return this.employeesRepository.find({});
  // }

  // async findById(id: string): Promise<Employee> {
  //   return this.employeesRepository.findOneBy({ id });
  // }

  // async update(employee: Employee, dto: UpdateEmployeeDTO): Promise<Employee> {
  //   return this.employeesRepository.save({
  //     ...employee,
  //     ...dto,
  //   });
  // }

  // async remove(id: string): Promise<void> {
  //   this.employeesRepository.delete(id);
  // }
}
