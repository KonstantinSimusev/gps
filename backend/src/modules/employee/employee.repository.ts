import { DeleteResult, In, IsNull, Not, Repository } from 'typeorm';
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
  async findAllWithWorkshopAndTeam(
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
        'employeeRole',
        'employeeRole.role',
      ],
    });
  }

  async findActiveEmployeeById(id: string): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { id, isActive: true },
      relations: ['account', 'position', 'position.workshop'],
      select: {
        id: true,
        lastName: true,
        firstName: true,
        patronymic: true,
        account: {
          id: true,
        },
        position: {
          id: true,
          workshop: {
            id: true,
            workshopCode: true,
          },
        },
      },
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
        'currentPosition.role',
        'employeeRole',
        'employeeRole.role',
      ],
    });
  }

  async findWithWorkshopCodeById(id: string): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { id },
      relations: ['position', 'position.workshop'],
      select: {
        id: true,
        position: {
          id: true,
          workshop: {
            id: true,
            workshopCode: true,
          },
        },
      },
    });
  }

  // 3. CRUD: Update
  async save(employee: Employee): Promise<Employee> {
    return this.employeeRepository.save(employee);
  }

  // 4. CRUD: Delete
  async remove(id: string): Promise<DeleteResult> {
    return this.employeeRepository.delete(id);
  }

  // 5. Вспомогательные методы проверки существования (Exists)
  async existsByFullName(
    lastName: string,
    firstName: string,
    patronymic: string,
  ): Promise<boolean> {
    return this.employeeRepository.exists({
      where: {
        lastName,
        firstName,
        patronymic,
      },
    });
  }

  async existsByPersonalNumber(personalNumber: number): Promise<boolean> {
    return this.employeeRepository.exists({
      where: { personalNumber },
    });
  }

  async existsByFullNameExcluding(
    employeeId: string,
    lastName: string,
    firstName: string,
    patronymic: string,
  ): Promise<boolean> {
    return await this.employeeRepository.exists({
      where: {
        id: Not(employeeId),
        lastName,
        firstName,
        patronymic,
      },
    });
  }

  async existsByPersonalNumberExcluding(
    employeeId: string,
    personalNumber: number,
  ): Promise<boolean> {
    return this.employeeRepository.exists({
      where: {
        id: Not(employeeId),
        personalNumber,
      },
    });
  }

  async existsCurrentMasterCreate(
    teamId: string,
    workshopId: string,
  ): Promise<boolean> {
    return this.employeeRepository.exists({
      where: [
        // Сценарий 1: currentTeam заполнен, currentPosition заполнен
        {
          hasAccess: true,
          isActive: true,
          currentTeam: { id: teamId },
          currentPosition: {
            workshop: { id: workshopId },
            role: { name: In(['LEAD_MASTER', 'MASTER', 'DETAIL_MASTER']) },
          },
        },
        // Сценарий 2: currentTeam NULL, currentPosition заполнен
        {
          hasAccess: true,
          isActive: true,
          currentTeam: IsNull(),
          team: { id: teamId },
          currentPosition: {
            workshop: { id: workshopId },
            role: { name: In(['LEAD_MASTER', 'MASTER', 'DETAIL_MASTER']) },
          },
        },
        // Сценарий 3: currentTeam заполнен, currentPosition NULL
        {
          hasAccess: true,
          isActive: true,
          currentTeam: { id: teamId },
          currentPosition: IsNull(),
          position: {
            workshop: { id: workshopId },
            role: { name: In(['LEAD_MASTER', 'MASTER', 'DETAIL_MASTER']) },
          },
        },
        // Сценарий 4: currentTeam NULL, currentPosition NULL
        {
          hasAccess: true,
          isActive: true,
          currentTeam: IsNull(),
          team: { id: teamId },
          currentPosition: IsNull(),
          position: {
            workshop: { id: workshopId },
            role: { name: In(['LEAD_MASTER', 'MASTER', 'DETAIL_MASTER']) },
          },
        },
      ],
      relations: [
        'currentTeam',
        'team',
        'currentPosition',
        'currentPosition.workshop',
        'currentPosition.role',
        'position',
        'position.workshop',
        'position.role',
      ],
    });
  }

  async existsCurrentMasterUpdate(
    employeeId: string,
    teamId: string,
    workshopId: string,
  ): Promise<boolean> {
    return this.employeeRepository.exists({
      where: [
        // Сценарий 1: currentTeam заполнен, currentPosition заполнен
        {
          id: Not(employeeId),
          hasAccess: true,
          isActive: true,
          currentTeam: { id: teamId },
          currentPosition: {
            workshop: { id: workshopId },
            role: { name: In(['LEAD_MASTER', 'MASTER', 'DETAIL_MASTER']) },
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
            role: { name: In(['LEAD_MASTER', 'MASTER', 'DETAIL_MASTER']) },
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
            role: { name: In(['LEAD_MASTER', 'MASTER', 'DETAIL_MASTER']) },
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
            role: { name: In(['LEAD_MASTER', 'MASTER', 'DETAIL_MASTER']) },
          },
        },
      ],
      relations: [
        'currentTeam',
        'team',
        'currentPosition',
        'currentPosition.workshop',
        'currentPosition.role',
        'position',
        'position.workshop',
        'position.role',
      ],
    });
  }
}
