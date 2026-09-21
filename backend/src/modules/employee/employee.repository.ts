import { In, IsNull, Not, Repository } from 'typeorm';
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
      relations: [
        'team',
        'position',
        'position.workshop',
        'position.profession',
        'position.grade',
        'position.schedule',
        'position.role',
        'currentTeam',
        'currentPosition',
        'currentPosition.workshop',
        'currentPosition.profession',
        'currentPosition.grade',
        'currentPosition.schedule',
        'currentPosition.role',
      ],
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
      relations: [
        'team',
        'position',
        'position.workshop',
        'position.profession',
        'position.grade',
        'position.schedule',
        'position.role',
        'currentTeam',
        'currentPosition',
        'currentPosition.workshop',
        'currentPosition.profession',
        'currentPosition.grade',
        'currentPosition.schedule',
        'currentPosition.role',
      ],
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

      relations: ['team', 'position', 'position.workshop', 'position.role'],
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
      where: [
        // Сценарий 1: currentTeam заполнен, currentPosition заполнен
        {
          id: Not(employeeId),
          hasAccess: true,
          isActive: true,
          currentTeam: { id: teamId },
          currentPosition: {
            workshop: { id: workshopId },
            schedule: { id: scheduleId },
            role: { id: roleId },
          },
        },
        // Сценарий 2: currentTeam NULL, currentPosition заполнен
        {
          id: Not(employeeId),
          hasAccess: true,
          isActive: true,
          currentTeam: IsNull(),
          team: { id: teamId },
          currentPosition: {
            workshop: { id: workshopId },
            schedule: { id: scheduleId },
            role: { id: roleId },
          },
        },
        // Сценарий 3: currentTeam заполнен, currentPosition NULL
        {
          id: Not(employeeId),
          hasAccess: true,
          isActive: true,
          currentTeam: { id: teamId },
          currentPosition: IsNull(),
          position: {
            workshop: { id: workshopId },
            schedule: { id: scheduleId },
            role: { id: roleId },
          },
        },
        // Сценарий 4: currentTeam NULL, currentPosition NULL
        {
          id: Not(employeeId),
          hasAccess: true,
          isActive: true,
          currentTeam: IsNull(),
          team: { id: teamId },
          currentPosition: IsNull(),
          position: {
            workshop: { id: workshopId },
            schedule: { id: scheduleId },
            role: { id: roleId },
          },
        },
      ],
      relations: [
        'team',
        'position',
        'position.workshop',
        'position.role',
        'currentTeam',
        'currentPosition',
        'currentPosition.workshop',
        'currentPosition.role',
      ],
    });
  }
}
