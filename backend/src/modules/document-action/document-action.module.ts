import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentAction } from './entities/document-action.entity';
import { DocumentActionRepository } from './document-action.repository';
import { DocumentActionService } from './document-action.service';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentAction])],
  controllers: [],
  providers: [DocumentActionRepository, DocumentActionService],
  exports: [DocumentActionService],
})
export class DocumentActionModule {}
