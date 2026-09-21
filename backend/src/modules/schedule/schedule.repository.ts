import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Schedule } from './entities/schedule.entity';

@Injectable()
export class ScheduleRepository {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  // 2. CRUD: Read (общие методы поиска)
  async findScheduleByCode(scheduleCode: string): Promise<Schedule | null> {
    return this.scheduleRepository.findOneBy({ scheduleCode });
  }

  async findScheduleById(id: string): Promise<Schedule | null> {
    return this.scheduleRepository.findOneBy({ id });
  }
}
