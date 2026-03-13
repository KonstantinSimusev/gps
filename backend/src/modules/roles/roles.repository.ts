import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from './entities/role.entity';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async findRoleByAccount(accountId: string): Promise<{ name: string } | null> {
    return await this.rolesRepository
      .createQueryBuilder('role')
      .select('role.name', 'name')
      .innerJoin('role.positions', 'position')
      .innerJoin('position.employees', 'employee')
      .innerJoin('employee.account', 'account')
      .where('account.id = :accountId', { accountId })
      .andWhere('employee.isActive = true')
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
