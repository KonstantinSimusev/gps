import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DocumentReason } from './entities/document-reason.entity';

@Injectable()
export class DocumentReasonRepository {
  constructor(
    @InjectRepository(DocumentReason)
    private readonly documentReasonRepository: Repository<DocumentReason>,
  ) {}

  async findByDocumentReasonCode(
    documentReasonCode: string,
  ): Promise<DocumentReason | null> {
    return this.documentReasonRepository.findOne({
      where: { documentReasonCode },
    });
  }
}
