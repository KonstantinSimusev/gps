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

  // async findRoleByEmployee(id: string): Promise<Role | null> {
  //   return this.rolesRepository.findOne({
  //     where: {
  //       positions: {
  //         employees: {
  //           id,
  //           isActive: true,
  //         },
  //       },
  //     },
  //     select: {
  //       id: true, // обязательно для JOIN
  //       name: true, // нужное поле
  //     },
  //     relations: ['positions', 'positions.employees'], // явные связи
  //   });
  // }

  async findRoleByEmployee(id: string): Promise<{ name: string } | null> {
    return await this.rolesRepository
      .createQueryBuilder('role')
      .innerJoin('role.positions', 'position')
      .innerJoin('position.employees', 'employee')
      .where('employee.id = :id', { id })
      .andWhere('employee.isActive = true')
      .select('role.name')
      .getOne();
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
