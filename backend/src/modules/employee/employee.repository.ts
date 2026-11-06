import { Not, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  // 1. CRUD: Create
  async create(data: Partial<Employee>): Promise<Employee> {
    const employee = this.employeeRepository.create(data);
    return this.employeeRepository.save(employee);
  }

  // 2. CRUD: Read (общие методы поиска)
  async findByTeamAndSchedule(
    teamNumber: number,
    workshopCode: string,
    scheduleCode: string,
  ): Promise<Employee[]> {
    return this.employeeRepository.find({
      where: {
        isActive: true,
        team: { teamNumber },
        position: {
          workshop: { workshopCode },
          schedule: { scheduleCode },
        },
      },
      relations: [
        'position',
        'position.workshop',
        'position.profession',
        'position.schedule',
      ],
    });
  }

  async findEmployeeById(id: string): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { id },
      relations: this.EMPLOYEE_RELATIONS,
    });
  }

  async findActiveEmployeeById(id: string): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { id, isActive: true },
      relations: ['account', 'position', 'position.workshop'],
    });
  }

  async findByPersonalNumber(personalNumber: number): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { personalNumber },
      relations: this.EMPLOYEE_RELATIONS,
    });
  }

  async findWithWorkshopById(id: string): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { id },
      relations: ['position', 'position.workshop'],
    });
  }

  // 3. CRUD: Update
  async save(employee: Employee): Promise<Employee> {
    return this.employeeRepository.save(employee);
  }

  // 4. CRUD: Delete
  // async remove(id: string): Promise<DeleteResult> {
  //   return this.employeeRepository.delete(id);
  // }

  // 5. Вспомогательные методы проверки существования
  async countByFullName(
    lastName: string,
    firstName: string,
    patronymic: string,
  ): Promise<number> {
    return this.employeeRepository.count({
      where: {
        lastName,
        firstName,
        patronymic,
      },
    });
  }

  async countByPersonalNumber(personalNumber: number): Promise<number> {
    return this.employeeRepository.count({
      where: { personalNumber },
    });
  }

  async countByFullNameExcluding(
    employeeId: string,
    lastName: string,
    firstName: string,
    patronymic: string,
  ): Promise<number> {
    return this.employeeRepository.count({
      where: {
        id: Not(employeeId), // Исключаем текущего сотрудника
        lastName,
        firstName,
        patronymic,
      },
    });
  }

  async countByPersonalNumberExcluding(
    employeeId: string,
    personalNumber: number,
  ): Promise<number> {
    return this.employeeRepository.count({
      where: {
        id: Not(employeeId), // Исключаем текущего сотрудника
        personalNumber,
      },
    });
  }

  async countTeamManagers(
    teamId: string,
    workshopId: string,
    scheduleId: string,
    roleId: string,
  ): Promise<number> {
    return this.employeeRepository.count({
      where: {
        hasAccess: true,
        isActive: true,
        team: { id: teamId },
        position: {
          workshop: { id: workshopId },
          schedule: { id: scheduleId },
          role: { id: roleId },
        },
      },
      relations: [
        'team',
        'position',
        'position.workshop',
        'position.profession',
        'position.grade',
        'position.schedule',
        'position.paymentSystem',
        'position.role',
      ],
    });
  }

  async countTeamManagersExcluding(
    employeeId: string,
    teamId: string,
    workshopId: string,
    scheduleId: string,
    roleId: string,
  ): Promise<number> {
    return this.employeeRepository.count({
      where: {
        id: Not(employeeId),
        hasAccess: true,
        isActive: true,
        profileTeam: { id: teamId },
        profilePosition: {
          workshop: { id: workshopId },
          schedule: { id: scheduleId },
          role: { id: roleId },
        },
      },
      relations: [
        'team',
        'position',
        'position.workshop',
        'position.profession',
        'position.grade',
        'position.schedule',
        'position.paymentSystem',
        'position.role',
        'profileTeam',
        'profilePosition',
        'profilePosition.workshop',
        'profilePosition.profession',
        'profilePosition.grade',
        'profilePosition.schedule',
        'profilePosition.paymentSystem',
        'profilePosition.role',
      ],
    });
  }

  private EMPLOYEE_RELATIONS = [
    'account',
    'team',
    'position',
    'position.workshop',
    'position.profession',
    'position.grade',
    'position.schedule',
    'position.paymentSystem',
    'position.role',
    'profileTeam',
    'profilePosition',
    'profilePosition.workshop',
    'profilePosition.profession',
    'profilePosition.grade',
    'profilePosition.schedule',
    'profilePosition.paymentSystem',
    'profilePosition.role',
    'employeeShifts',
  ];
}
