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
      relations: [
        'workshop',
        'team',
        'schedule',
        'shiftSchedule',
        'shiftSchedule.shiftType',
        'employeeShifts',
        'employeeShifts.attendanceType',
        'employeeShifts.workPlace',
      ],
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
      relations: [
        'workshop',
        'team',
        'schedule',
        'shiftSchedule',
        'shiftSchedule.shiftType',
        'employeeShifts',
        'employeeShifts.attendanceType',
        'employeeShifts.workPlace',
      ],
      order: {
        date: 'DESC', // ← сортировка по дате: от новых к старым
      },
    });
  }

  async findOneById(shiftId: string): Promise<Shift | null> {
    return this.shiftRepository.findOne({
      where: { id: shiftId },
      relations: [
        'workshop',
        'team',
        'schedule',
        'shiftSchedule',
        'shiftSchedule.shiftType',
        'employeeShifts',
        'employeeShifts.attendanceType',
        'employeeShifts.workPlace',
      ],
    });
  }

  async findAllInCurrentAndPreviousMonth(
    workshopId: string,
    teamId: string,
    scheduleId: string,
  ): Promise<Shift[]> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0–11

    // 1-е число предыдущего месяца 00:00:00
    const start = new Date(year, month - 1, 1);
    start.setHours(0, 0, 0, 0);

    // Последний день текущего месяца 23:59:59
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

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
        'employeeShifts.workPlace',
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
}
