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

  async findEmployeeRoleByEmployee(id: string): Promise<EmployeeRole | null> {
    return this.employeeRolesRepository.findOne({
      where: {
        employee: {
          id,
          isActive: true,
        },
      },
      select: {
        isActive: true,
        id: true,
      },
      relations: ['role'],
    });
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
