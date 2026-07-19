import { Injectable, NotFoundException } from '@nestjs/common';

import { AttendanceType } from './entities/attendance-type.entity';
import { AttendanceTypeRepository } from './attendance-type.repository';

@Injectable()
export class AttendanceTypeService {
  constructor(
    private readonly attendanceTypeRepository: AttendanceTypeRepository,
  ) {}

  async getAttendanceType(code: string): Promise<AttendanceType> {
    const attendanceType =
      await this.attendanceTypeRepository.findAttendanceTypeByCode(code);

    if (!attendanceType) {
      throw new NotFoundException(
        `Тип посещаемости ${code} не найден в базе данных`,
      );
    }

    return attendanceType;
  }
}
