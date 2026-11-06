import { Injectable } from '@nestjs/common';

import { Document } from './entities/document.entity';
import { DocumentRepository } from './document.repository';

@Injectable()
export class DocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async getAllDocuments(
    workshopCode: string,
    teamNumber: number,
    scheduleCode: string,
    shiftDate: Date,
  ): Promise<Document[]> {
    const documents =
      await this.documentRepository.findByWorkshopTeamScheduleAndDate(
        workshopCode,
        teamNumber,
        scheduleCode,
        shiftDate,
      );

    return documents;
  }
}
