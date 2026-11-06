import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentType } from './entities/document-type.entity';
import { DocumentTypeRepository } from './document-type.repository';
import { DocumentTypeService } from './document-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentType])],
  controllers: [],
  providers: [DocumentTypeRepository, DocumentTypeService],
  exports: [DocumentTypeService],
})
export class DocumentTypeModule {}
