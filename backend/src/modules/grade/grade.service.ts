import { Injectable, NotFoundException } from '@nestjs/common';

import { Grade } from './entities/grade.entity';
import { GradeRepository } from './grade.repository';

@Injectable()
export class GradeService {
  constructor(private readonly gradeRepository: GradeRepository) {}

  async getGrade(gradeCode: number): Promise<Grade> {
    const grade = await this.gradeRepository.findOneByCode(gradeCode);

    if (grade === null) {
      throw new NotFoundException('Разряд не найден');
    }

    return grade;
  }
}
