import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Document } from './entities/document.entity';
import { DocumentService } from './document.service';
import { DocumentRepository } from './document.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  controllers: [],
  providers: [DocumentRepository, DocumentService],
  exports: [DocumentRepository, DocumentService],
})
export class DocumentModule {}
