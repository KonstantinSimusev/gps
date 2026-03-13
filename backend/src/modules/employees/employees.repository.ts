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

  async findByAccount(id: string): Promise<{ id: string } | null> {
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

  async findEmployeeByAccount(accountId: string): Promise<{
    id: string;
    workshopCode: string;
    teamNumber: string;
  } | null> {
    return await this.employeesRepository
      .createQueryBuilder('employee')
      .innerJoin('employee.account', 'account') // Связываем сотрудника с аккаунтом
      .where('account.id = :accountId', { accountId }) // Фильтруем по ID аккаунта
      .andWhere('employee.isActive = true') // Учитываем только активных сотрудников
      .select('employee.id', 'id') // Выбираем ID сотрудника
      .innerJoin('employee.team', 'team') // Присоединяем бригаду (Team)
      .addSelect('team.teamNumber', 'teamNumber') // Выбираем номер бригады
      .innerJoin('employee.position', 'position') // Присоединяем позицию (Position) — промежуточное звено
      .innerJoin('position.workshop', 'workshop') // Теперь можем присоединить цех (Workshop) через позицию
      .addSelect('workshop.workshopCode', 'workshopCode') // Выбираем код цеха
      .getRawOne();
  }

  // async findEmployeeRoleByAccount(
  //   accountId: string,
  // ): Promise<{ employeeId: string; role: string; isActive: boolean } | null> {
  //   return await this.employeesRepository
  //     .createQueryBuilder('employee')
  //     .select('employee.id', 'employeeId')
  //     .innerJoin('employee.account', 'account')
  //     .where('account.id = :accountId', { accountId })
  //     .andWhere('employee.isActive = true')
  //     .innerJoin('employee.employeeRoles', 'employeeRole')
  //     .innerJoin('employeeRole.role', 'role')
  //     .addSelect('role.name', 'role')
  //     .addSelect('employeeRole.is_active', 'isActive')
  //     .getRawOne();
  // }

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
