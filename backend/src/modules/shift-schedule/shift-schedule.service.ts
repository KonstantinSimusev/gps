import { Injectable, NotFoundException } from '@nestjs/common';

import { ShiftSchedule } from './entities/shift-schedule.entity';
import { ShiftScheduleRepository } from './shift-schedule.repository';

@Injectable()
export class ShiftScheduleService {
  constructor(
    private readonly shiftScheduleRepository: ShiftScheduleRepository,
  ) {}

  async getShiftSchedule(
    dayOfWeek: number,
    workshopCode: string,
    scheduleCode: string,
    shiftNumber: number,
  ): Promise<ShiftSchedule> {
    const shiftSchedule =
      await this.shiftScheduleRepository.findShiftScheduleBy(
        dayOfWeek,
        workshopCode,
        scheduleCode,
        shiftNumber,
      );

    if (!shiftSchedule) {
      throw new NotFoundException('Расписание смены не найдено');
    }

    return shiftSchedule;
  }
}
