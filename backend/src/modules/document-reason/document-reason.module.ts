import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentReason } from './entities/document-reason.entity';
import { DocumentReasonRepository } from './document-reason.repository';
import { DocumentReasonService } from './document-reason.service';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentReason])],
  controllers: [],
  providers: [DocumentReasonRepository, DocumentReasonService],
  exports: [DocumentReasonService],
})
export class DocumentReasonModule {}
