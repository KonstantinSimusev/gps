import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EmployeeShift } from './entities/employee-shift.entity';

@Injectable()
export class EmployeeShiftRepository {
  constructor(
    @InjectRepository(EmployeeShift)
    private readonly employeeShiftRepository: Repository<EmployeeShift>,
  ) {}

  // 1. CRUD: Create
  async create(data: Partial<EmployeeShift>): Promise<EmployeeShift> {
    const employeeShift = this.employeeShiftRepository.create(data);
    return this.employeeShiftRepository.save(employeeShift);
  }

  // 2. CRUD: Read (общие методы поиска)
  async findAllWithWorkshopAndTeam(
    teamNumber: number,
    workshopCode: string,
  ): Promise<EmployeeShift[]> {
    return this.employeeShiftRepository.find({
      where: {},
      relations: [],
    });
  }
}
