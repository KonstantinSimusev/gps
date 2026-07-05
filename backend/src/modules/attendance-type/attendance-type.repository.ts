import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AttendanceType } from './entities/attendance-type.entity';

@Injectable()
export class AttendanceTypeRepository {
  constructor(
    @InjectRepository(AttendanceType)
    private readonly attendanceTypeRepository: Repository<AttendanceType>,
  ) {}

  async findAttendanceTypeByCode(
    attendanceCode: string,
  ): Promise<AttendanceType | null> {
    return this.attendanceTypeRepository.findOne({
      where: { attendanceCode },
    });
  }
}
