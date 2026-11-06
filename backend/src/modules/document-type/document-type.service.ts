import { Injectable, NotFoundException } from '@nestjs/common';

import { DocumentType } from './entities/document-type.entity';
import { DocumentTypeRepository } from './document-type.repository';

@Injectable()
export class DocumentTypeService {
  constructor(
    private readonly documentTypeRepository: DocumentTypeRepository,
  ) {}

  async getDocumentType(code: string): Promise<DocumentType> {
    const documentType =
      await this.documentTypeRepository.findByDocumentTypeCode(code);

    if (!documentType) {
      throw new NotFoundException(`Тип документа ${code} не найден`);
    }

    return documentType;
  }
}
