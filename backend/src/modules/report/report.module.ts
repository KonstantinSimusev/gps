import { Module } from '@nestjs/common';

import { ReportService } from './report.service';
import { ReportController } from './report.controller';

// import { AuthModule } from '../auth/auth.module';
import { ShiftModule } from '../shift/shift.module';
import { ResidueModule } from '../residue/residue.module';

@Module({
  imports: [ShiftModule, ResidueModule],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [],
})
export class ReportModule {}
