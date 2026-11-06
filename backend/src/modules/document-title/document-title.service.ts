import { Injectable, NotFoundException } from '@nestjs/common';

import { DocumentTitle } from './entities/document-title.entity';
import { DocumentTitleRepository } from './document-title.repository';

@Injectable()
export class DocumentTitleService {
  constructor(
    private readonly documentTitleRepository: DocumentTitleRepository,
  ) {}

  async getDocumentTitle(code: string): Promise<DocumentTitle> {
    const documentTitle =
      await this.documentTitleRepository.findByDocumentTitleCode(code);

    if (!documentTitle) {
      throw new NotFoundException(`Заголовок документа ${code} не найден`);
    }

    return documentTitle;
  }
}
