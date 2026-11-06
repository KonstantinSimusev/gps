import { Injectable, NotFoundException } from '@nestjs/common';

import { DocumentReason } from './entities/document-reason.entity';
import { DocumentReasonRepository } from './document-reason.repository';

@Injectable()
export class DocumentReasonService {
  constructor(
    private readonly documentReasonRepository: DocumentReasonRepository,
  ) {}

  async getDocumentReason(code: string): Promise<DocumentReason> {
    const documentReason =
      await this.documentReasonRepository.findByDocumentReasonCode(code);

    if (!documentReason) {
      throw new NotFoundException(`Причина документа ${code} не найдена`);
    }

    return documentReason;
  }
}
