import { DeleteResult, Not, Repository, UpdateResult } from 'typeorm';
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
  async findEmployeeById(id: string): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { id },
      relations: ['team', 'position', 'employeeRole', 'employeeRole.role'],
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

  async findByPersonalNumber(personalNumber: string): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { personalNumber },
      relations: [
        'team',
        'position',
        'position.workshop',
        'position.profession',
        'position.grade',
        'position.schedule',
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

  async existsByPersonalNumber(personalNumber: string): Promise<boolean> {
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
    personalNumber: string,
  ): Promise<boolean> {
    return this.employeeRepository.exists({
      where: {
        id: Not(employeeId),
        personalNumber,
      },
    });
  }
}
