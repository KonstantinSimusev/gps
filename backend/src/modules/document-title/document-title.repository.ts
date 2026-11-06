import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DocumentTitle } from './entities/document-title.entity';

@Injectable()
export class DocumentTitleRepository {
  constructor(
    @InjectRepository(DocumentTitle)
    private readonly documentTitleRepository: Repository<DocumentTitle>,
  ) {}

  async findByDocumentTitleCode(
    documentTitleCode: string,
  ): Promise<DocumentTitle | null> {
    return this.documentTitleRepository.findOne({
      where: { documentTitleCode },
    });
  }
}
