import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Notice } from './entities/notice.entity';

@Injectable()
export class NoticeRepository {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

  // 1. CRUD: Create
  async create(data: Partial<Notice>): Promise<Notice> {
    const entity = this.noticeRepository.create(data);
    return this.noticeRepository.save(entity);
  }

  // 2. CRUD: Read (общие методы поиска)
  async findAllUnresolved(
    workshopId: string,
    teamId: string,
    scheduleId: string,
  ): Promise<Notice[]> {
    return this.noticeRepository.find({
      where: {
        isResolved: false,
        workshop: { id: workshopId },
        team: { id: teamId },
        schedule: { id: scheduleId },
      },
      relations: [
        'title',
        'title.category',
        'title.status',
        'title.action',
        'workshop',
        'team',
        'schedule',
      ],
      order: {
        createdAt: 'DESC', // новые сверху
      },
    });
  }

  async findOneById(id: string): Promise<Notice | null> {
    return this.noticeRepository.findOne({
      where: { id },
      relations: [
        'title',
        'title.category',
        'title.status',
        'title.action',
        'workshop',
        'team',
        'schedule',
      ],
    });
  }

  async countBySourceDate(
    sourceDate: Date,
    titleId: string,
    workshopId: string,
    teamId: string,
    scheduleId: string,
  ): Promise<number> {
    return this.noticeRepository.count({
      where: {
        sourceDate,
        title: { id: titleId },
        workshop: { id: workshopId },
        team: { id: teamId },
        schedule: { id: scheduleId },
      },
    });
  }

  async countBySourceId(
    sourceId: string,
    titleId: string,
    workshopId: string,
    teamId: string,
    scheduleId: string,
  ): Promise<number> {
    return this.noticeRepository.count({
      where: {
        sourceId,
        title: { id: titleId },
        workshop: { id: workshopId },
        team: { id: teamId },
        schedule: { id: scheduleId },
      },
    });
  }

  // 3. CRUD: Update
  async save(entity: Notice): Promise<Notice> {
    return this.noticeRepository.save(entity);
  }
}
