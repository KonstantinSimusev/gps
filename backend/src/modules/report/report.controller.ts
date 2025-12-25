import { Controller, Get, Req, Res } from '@nestjs/common';

import { Response, Request } from 'express';

import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('residues')
  async getResiduesReport(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.reportService.getResiduesReport(req, res);
  }
}
