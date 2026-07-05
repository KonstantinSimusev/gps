import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ShiftSchedule } from './entities/shift-schedule.entity';

@Injectable()
export class ShiftScheduleRepository {
  constructor(
    @InjectRepository(ShiftSchedule)
    private readonly shiftScheduleRepository: Repository<ShiftSchedule>,
  ) {}

  // 2. CRUD: Read (общие методы поиска)
  async findShiftScheduleBy(
    dayOfWeek: number,
    workshopCode: string,
    scheduleCode: string,
    shiftCode: number,
  ): Promise<ShiftSchedule | null> {
    return this.shiftScheduleRepository.findOne({
      where: {
        dayOfWeek,
        workshop: { workshopCode },
        schedule: { scheduleCode },
        shiftType: { shiftCode },
      },
      relations: ['workshop', 'schedule', 'shiftType'],
    });
  }
}
