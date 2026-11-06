import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DocumentAction } from './entities/document-action.entity';

@Injectable()
export class DocumentActionRepository {
  constructor(
    @InjectRepository(DocumentAction)
    private readonly documentActionRepository: Repository<DocumentAction>,
  ) {}

  async findByDocumentActionCode(
    documentActionCode: string,
  ): Promise<DocumentAction | null> {
    return this.documentActionRepository.findOne({
      where: { documentActionCode },
    });
  }
}
