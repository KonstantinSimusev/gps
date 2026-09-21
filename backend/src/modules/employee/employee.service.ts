import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Employee } from './entities/employee.entity';
import { EmployeeRepository } from './employee.repository';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async getEmployee(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findEmployeeById(id);

    if (!employee) {
      throw new NotFoundException('Работник не найден');
    }

    return employee;
  }

  async getActiveEmployee(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findActiveEmployeeById(id);

    if (!employee) {
      throw new NotFoundException('Работник не найден');
    }

    return employee;
  }

  async getEmployeeByPersonalNumber(personalNumber: number): Promise<Employee> {
    const employee =
      await this.employeeRepository.findByPersonalNumber(personalNumber);

    if (!employee) {
      throw new NotFoundException('Работник не найден');
    }

    return employee;
  }

  async getEmployeeWithWorkshopById(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findWithWorkshopById(id);

    if (!employee) {
      throw new NotFoundException('Работник не найден');
    }

    return employee;
  }

  async getTeamEmployees(
    teamNumber: number,
    workshopCode: string,
    scheduleCode: string,
  ): Promise<Employee[]> {
    const employees = await this.employeeRepository.findByTeamAndSchedule(
      teamNumber,
      workshopCode,
      scheduleCode,
    );

    if (employees.length === 0) {
      throw new NotFoundException(
        `Не найдены сотрудники для бригады ${teamNumber}, цеха ${workshopCode}, графика ${scheduleCode}`,
      );
    }

    return employees;
  }

  async validateUniqueFullName(
    lastName: string,
    firstName: string,
    patronymic: string,
  ): Promise<void> {
    const count = await this.employeeRepository.countByFullName(
      lastName,
      firstName,
      patronymic,
    );

    if (count > 0) {
      throw new ConflictException('ФИО занято');
    }
  }

  async validateUniqueFullNameExcluding(
    employeeId: string,
    lastName: string,
    firstName: string,
    patronymic: string,
  ): Promise<void> {
    const count = await this.employeeRepository.countByFullNameExcluding(
      employeeId,
      lastName,
      firstName,
      patronymic,
    );

    if (count > 0) {
      throw new ConflictException('ФИО занято');
    }
  }

  async validateUniquePersonalNumber(personalNumber: number): Promise<void> {
    const count =
      await this.employeeRepository.countByPersonalNumber(personalNumber);

    if (count > 0) {
      throw new ConflictException('Личный номер занят');
    }
  }

  async validateUniquePersonalNumberExcluding(
    employeeId: string,
    personalNumber: number,
  ): Promise<void> {
    const count = await this.employeeRepository.countByPersonalNumberExcluding(
      employeeId,
      personalNumber,
    );

    if (count > 0) {
      throw new ConflictException('Личный номер занят');
    }
  }

  async existsTeamManager(
    teamId: string,
    workshopId: string,
    scheduleId: string,
    roleId: string,
  ): Promise<void> {
    const count = await this.employeeRepository.countTeamManagers(
      teamId,
      workshopId,
      scheduleId,
      roleId,
    );

    if (count > 0) {
      throw new ConflictException('Руководитель уже существует');
    }
  }

  async existsTeamManagerExcluding(
    employeeId: string,
    teamId: string,
    workshopId: string,
    scheduleId: string,
    roleId: string,
  ): Promise<void> {
    const count = await this.employeeRepository.countTeamManagersExcluding(
      employeeId,
      teamId,
      workshopId,
      scheduleId,
      roleId,
    );

    if (count > 0) {
      throw new ConflictException('Руководитель уже существует');
    }
  }
}
