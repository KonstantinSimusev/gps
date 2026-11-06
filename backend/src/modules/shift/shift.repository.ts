import { Between, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Shift } from './entities/shift.entity';

@Injectable()
export class ShiftRepository {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) {}

  // 1. CRUD: Create
  async create(data: Partial<Shift>): Promise<Shift> {
    const shift = this.shiftRepository.create(data);
    return this.shiftRepository.save(shift);
  }

  // 2. CRUD: Read (общие методы поиска)
  async findOneById(id: string): Promise<Shift | null> {
    return this.shiftRepository.findOne({
      where: { id },
      relations: this.SHIFT_RELATIONS,
      order: this.EMPLOYEE_SHIFTS_ORDER,
    });
  }

  async findOneByDate(
    date: Date,
    workshopId: string,
    teamId: string,
    scheduleId: string,
  ): Promise<Shift | null> {
    return this.shiftRepository.findOne({
      where: {
        date,
        workshop: { id: workshopId },
        team: { id: teamId },
        schedule: { id: scheduleId },
      },
      relations: this.SHIFT_RELATIONS,
      order: this.EMPLOYEE_SHIFTS_ORDER,
    });
  }

  async findAllByDate(
    date: Date,
    workshopId: string,
    teamId: string,
    scheduleId: string,
  ): Promise<Shift[]> {
    return this.shiftRepository.find({
      where: {
        date,
        workshop: { id: workshopId },
        team: { id: teamId },
        schedule: { id: scheduleId },
      },
      relations: this.SHIFT_RELATIONS,
      order: {
        date: 'DESC',
        ...this.EMPLOYEE_SHIFTS_ORDER,
      },
    });
  }

  async findAllInRange(
    workshopId: string,
    teamId: string,
    scheduleId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Shift[]> {
    // Нормализуем границы диапазона в UTC
    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setUTCHours(0, 0, 0, 0);

    return this.shiftRepository.find({
      where: {
        date: Between(start, end),
        workshop: { id: workshopId },
        team: { id: teamId },
        schedule: { id: scheduleId },
      },
      relations: [
        'workshop',
        'team',
        'schedule',
        'shiftSchedule',
        'shiftSchedule.shiftType',
        'employeeShifts',
        'employeeShifts.attendanceType',
        'employeeShifts.workplace',
      ],
      order: {
        date: 'DESC',
      },
    });
  }

  async countShifts(
    date: Date,
    workshopId: string,
    teamId: string,
    scheduleId: string,
  ): Promise<number> {
    return this.shiftRepository.count({
      where: {
        date,
        workshop: { id: workshopId },
        team: { id: teamId },
        schedule: { id: scheduleId },
      },
    });
  }

  // 3. CRUD: Update
  async save(shift: Shift): Promise<Shift> {
    return this.shiftRepository.save(shift);
  }

  private SHIFT_RELATIONS = [
    'workshop',
    'team',
    'schedule',
    'shiftSchedule',
    'shiftSchedule.shiftType',
    'employeeShifts',
    'employeeShifts.employee',
    'employeeShifts.employee.team',
    'employeeShifts.employee.position',
    'employeeShifts.employee.position.workshop',
    'employeeShifts.employee.position.profession',
    'employeeShifts.employee.position.grade',
    'employeeShifts.employee.position.schedule',
    'employeeShifts.employee.position.paymentSystem',
    'employeeShifts.employee.position.role',
    'employeeShifts.currentPosition',
    'employeeShifts.currentPosition.workshop',
    'employeeShifts.currentPosition.profession',
    'employeeShifts.currentPosition.grade',
    'employeeShifts.currentPosition.schedule',
    'employeeShifts.currentPosition.paymentSystem',
    'employeeShifts.currentPosition.role',
    'employeeShifts.attendanceType',
    'employeeShifts.workplace',
  ];

  private EMPLOYEE_SHIFTS_ORDER = {
    employeeShifts: {
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
  } as const;
}
