import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Grade } from './entities/grade.entity';

@Injectable()
export class GradeRepository {
  constructor(
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
  ) {}

  // 2. CRUD: Read (общие методы поиска)
  async findOneByCode(gradeCode: number): Promise<Grade | null> {
    return this.gradeRepository.findOneBy({ gradeCode });
  }
}
