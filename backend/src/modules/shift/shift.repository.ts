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
  async findAll(workshopId: string, teamId: string): Promise<Shift[]> {
    const currentDate = new Date();

    const firstDayOfMonth = new Date(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      1,
    );

    const lastDayOfMonth = new Date(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth() + 1,
      0, // 0-й день следующего месяца — это последний день текущего
    );

    return this.shiftRepository.find({
      where: {
        workshop: { id: workshopId },
        team: { id: teamId },
        date: Between(firstDayOfMonth, lastDayOfMonth),
      },
      relations: [
        'workshop',
        'team',
        'shiftSchedule',
        'shiftSchedule.shiftType',
        'employeeShifts',
      ],
    });
  }

  // 5. Вспомогательные методы проверки существования (Exists)
  async existsByWorkshopTeamDate(
    workshopId: string,
    teamId: string,
    date: Date,
  ): Promise<boolean> {
    return this.shiftRepository.exists({
      where: {
        workshop: { id: workshopId },
        team: { id: teamId },
        date,
      },
    });
  }
}
