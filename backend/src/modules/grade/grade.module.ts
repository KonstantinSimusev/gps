import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Grade } from './entities/grade.entity';
import { GradeRepository } from './grade.repository';
import { GradeService } from './grade.service';

@Module({
  imports: [TypeOrmModule.forFeature([Grade])],
  controllers: [],
  providers: [GradeRepository, GradeService],
  exports: [GradeRepository, GradeService],
})
export class GradeModule {}
