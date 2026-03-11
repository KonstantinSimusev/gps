import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  async save(employee: Employee): Promise<Employee> {
    return this.employeesRepository.save(employee);
  }

  async findByAccount(id: string): Promise<Employee | null> {
    return this.employeesRepository.findOne({
      where: {
        account: { id },
        isActive: true,
      },
      select: {
        id: true,
      },
    });
  }

  async findRoleByAccount(
    accountId: string,
  ): Promise<{ employeeId: string; role: string } | null> {
    return await this.employeesRepository
      .createQueryBuilder('employee')
      .select('employee.id', 'employeeId') // OK: employee уже есть
      // Сначала выполняем все JOIN, чтобы подключить таблицу role
      .innerJoin('employee.account', 'account')
      .where('account.id = :accountId', { accountId })
      .andWhere('employee.isActive = true')
      .innerJoin('employee.position', 'position')
      .innerJoin('position.role', 'role') // Подключаем role
      // Только после этого выбираем поле role.name
      .addSelect('role.name', 'role') // OK: role уже подключена
      .getRawOne();
  }

  async findEmployeeRoleByAccount(
    accountId: string,
  ): Promise<{ employeeId: string; role: string; isActive: boolean } | null> {
    return await this.employeesRepository
      .createQueryBuilder('employee')
      .select('employee.id', 'employeeId')
      .innerJoin('employee.account', 'account')
      .where('account.id = :accountId', { accountId })
      .andWhere('employee.isActive = true')
      .innerJoin('employee.employeeRoles', 'employeeRole')
      .innerJoin('employeeRole.role', 'role')
      .addSelect('role.name', 'role')
      .addSelect('employeeRole.is_active', 'isActive')
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
