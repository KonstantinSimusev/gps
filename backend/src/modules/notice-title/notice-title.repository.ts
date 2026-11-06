import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { NoticeTitle } from './entities/notice-title.entity';

@Injectable()
export class NoticeTitleRepository {
  constructor(
    @InjectRepository(NoticeTitle)
    private readonly noticeTitleRepository: Repository<NoticeTitle>,
  ) {}

  // 1. CRUD: Create
  async create(data: Partial<NoticeTitle>): Promise<NoticeTitle> {
    const entity = this.noticeTitleRepository.create(data);
    return this.noticeTitleRepository.save(entity);
  }

  // 2. CRUD: Read (общие методы поиска)
  async findAll(): Promise<NoticeTitle[]> {
    return this.noticeTitleRepository.find({});
  }

  async findByCriteria(
    categoryCode: string,
    actionCode: string,
    statusLabel: string,
  ): Promise<NoticeTitle | null> {
    return this.noticeTitleRepository.findOne({
      where: {
        category: { categoryCode },
        action: { actionCode },
        status: { statusLabel },
      },
      relations: ['category', 'action', 'status'],
    });
  }

  // 3. CRUD: Update
  async save(entity: NoticeTitle): Promise<NoticeTitle> {
    return this.noticeTitleRepository.save(entity);
  }
}
