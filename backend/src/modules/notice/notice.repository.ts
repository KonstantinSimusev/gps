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
  async findOneById(id: string): Promise<Notice | null> {
    return this.noticeRepository.findOne({
      where: { id },
    });
  }
  // 3. CRUD: Update
  async save(entity: Notice): Promise<Notice> {
    return this.noticeRepository.save(entity);
  }
}
