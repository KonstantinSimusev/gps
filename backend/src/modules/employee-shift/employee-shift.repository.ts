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
  async findAllByShiftId(shiftId: string): Promise<EmployeeShift[]> {
    return this.employeeShiftRepository.find({
      where: {
        shift: { id: shiftId },
      },
      relations: [
        'employee',
        'employee.position',
        'employee.position.profession',
        'employee.position.grade',
        'employee.position.schedule',
        'attendanceType',
        'currentPosition',
        'workPlace',
        'shift',
        'shift.schedule',
        'shift.team',
      ],
      order: {
        employee: {
          position: {
            grade: {
              gradeCode: 'DESC', // 1. Разряд: сверху большой, внизу маленький
            },
            profession: {
              name: 'ASC', // 2. Профессия: по алфавиту
            },
          },
          lastName: 'ASC', // 3. Фамилия: по алфавиту
          firstName: 'ASC', // 4. Имя: по алфавиту (если фамилии совпали)
          patronymic: 'ASC', // 5. Отчество: по алфавиту (если фамилии совпали)
        },
      },
    });
  }
}
