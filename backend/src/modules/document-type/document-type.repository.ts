import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DocumentType } from './entities/document-type.entity';

@Injectable()
export class DocumentTypeRepository {
  constructor(
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
  ) {}

  async findByDocumentTypeCode(
    documentTypeCode: string,
  ): Promise<DocumentType | null> {
    return this.documentTypeRepository.findOne({
      where: { documentTypeCode },
    });
  }
}
