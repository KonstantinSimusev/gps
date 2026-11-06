import { DeleteResult, Repository } from 'typeorm';
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
  async findById(id: string): Promise<EmployeeShift | null> {
    return this.employeeShiftRepository.findOne({
      where: { id },
      relations: [
        'attendanceType',
        'workplace',
        'shift',
        'shift.workshop',
        'shift.team',
        'shift.schedule',
        'shift.shiftSchedule',
        'shift.shiftSchedule.shiftType',
        'shift.shiftSchedule.workshop',
        'employee',
        'employee.team',
        'employee.position',
        'employee.position.workshop',
        'employee.position.profession',
        'employee.position.grade',
        'employee.position.schedule',
        'employee.position.paymentSystem',
        'employee.position.rateSystem',
        'employee.position.role',
        'currentPosition',
        'currentPosition.workshop',
        'currentPosition.profession',
        'currentPosition.grade',
        'currentPosition.schedule',
        'currentPosition.paymentSystem',
        'currentPosition.rateSystem',
        'currentPosition.role',
        'document',
      ],
    });
  }

  // 3. CRUD: Update
  async save(employeeShift: EmployeeShift): Promise<EmployeeShift> {
    return this.employeeShiftRepository.save(employeeShift);
  }

  // 4. CRUD: Delete
  async deleteById(id: string): Promise<DeleteResult> {
    return this.employeeShiftRepository.delete(id);
  }
}
