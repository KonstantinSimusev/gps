import { Injectable, NotFoundException } from '@nestjs/common';

import { IList, ISuccess } from '../../shared/interfaces/api.interface';

import { Shift } from './entities/shift.entity';
import { ShiftRepository } from './shift.repository';
import { ShiftIdDto } from './dto/shift-id.dto';

@Injectable()
export class ShiftService {
  constructor(private readonly shiftRepository: ShiftRepository) {}

  async getShiftById(dto: ShiftIdDto): Promise<Shift> {
    const shift = await this.shiftRepository.findOneById(dto.id);

    if (!shift) {
      throw new NotFoundException(`Смена с ID ${dto.id} не найдена`);
    }

    return shift;
  }

  async getShiftByDate(
    date: Date,
    workshopId: string,
    teamId: string,
    scheduleId: string,
  ): Promise<Shift | null> {
    const shift = await this.shiftRepository.findOneByDate(
      date,
      workshopId,
      teamId,
      scheduleId,
    );

    // if (!shift) {
    //   throw new NotFoundException('Смена не найдена');
    // }

    return shift;
  }

  async getAllShiftByDate(
    date: Date,
    workshopId: string,
    teamId: string,
    scheduleId: string,
  ): Promise<Shift[]> {
    const shifts = await this.shiftRepository.findAllByDate(
      date,
      workshopId,
      teamId,
      scheduleId,
    );

    return shifts;
  }

  async getAllInCurrentAndPreviousMonth(
    workshopId: string,
    teamId: string,
    scheduleId: string,
  ): Promise<Shift[]> {
    const shifts = await this.shiftRepository.findAllInCurrentAndPreviousMonth(
      workshopId,
      teamId,
      scheduleId,
    );

    return shifts;
  }

  async setCheckedByShiftId(dto: ShiftIdDto): Promise<ISuccess> {
    const shift = await this.shiftRepository.findOneById(dto.id);

    if (!shift) {
      throw new NotFoundException(`Смена с ID ${dto.id} не найдена`);
    }

    shift.isChecked = true;
    await this.shiftRepository.save(shift);

    return { message: 'Поле обновлено' };
  }
}
