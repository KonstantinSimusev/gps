import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentTitle } from './entities/document-title.entity';
import { DocumentTitleRepository } from './document-title.repository';
import { DocumentTitleService } from './document-title.service';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentTitle])],
  controllers: [],
  providers: [DocumentTitleRepository, DocumentTitleService],
  exports: [DocumentTitleService],
})
export class DocumentTitleModule {}
