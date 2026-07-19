import { Injectable, NotFoundException } from '@nestjs/common';

import { ShiftRepository } from './shift.repository';
import { Shift } from './entities/shift.entity';

@Injectable()
export class ShiftService {
  constructor(private readonly shiftRepository: ShiftRepository) {}

  async getCurrentShifts(
    date: Date,
    workshopId: string,
    teamId: string,
  ): Promise<Shift[]> {
    const shifts = await this.shiftRepository.findCurrentShifts(
      date,
      workshopId,
      teamId,
    );

    return shifts;
  }

  // async checkShiftExistence(
  //   workshopId: string,
  //   teamId: string,
  //   date: Date,
  // ): Promise<void> {
  //   const exists = await this.shiftRepository.existsByWorkshopTeamDate(
  //     workshopId,
  //     teamId,
  //     date,
  //   );

  //   if (exists) {
  //     throw new ConflictException('Смена уже существует');
  //   }
  // }
}
