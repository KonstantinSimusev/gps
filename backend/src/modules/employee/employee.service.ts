import { Injectable, NotFoundException } from '@nestjs/common';

import { Employee } from './entities/employee.entity';
import { EmployeeRepository } from './employee.repository';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

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
}
