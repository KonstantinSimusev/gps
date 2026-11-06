import { Injectable, NotFoundException } from '@nestjs/common';

import { DocumentAction } from './entities/document-action.entity';
import { DocumentActionRepository } from './document-action.repository';

@Injectable()
export class DocumentActionService {
  constructor(
    private readonly documentActionRepository: DocumentActionRepository,
  ) {}

  async getDocumentAction(code: string): Promise<DocumentAction> {
    const documentAction =
      await this.documentActionRepository.findByDocumentActionCode(code);

    if (!documentAction) {
      throw new NotFoundException(`Действие документа ${code} не найдено`);
    }

    return documentAction;
  }
}
