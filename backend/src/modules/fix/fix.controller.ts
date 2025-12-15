import { Body, Controller, Put, Req, Res } from '@nestjs/common';

import { Request, Response } from 'express';

import { FixService } from './fix.service';

import { UpdateFixDTO } from './dto/update-fix.dto';
import { ISuccess } from '../../shared/interfaces/api.interface';

@Controller('fixs')
export class FixController {
  constructor(private readonly fixService: FixService) {}

  @Put('update-fix')
  async updateFix(
    @Body() dto: UpdateFixDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ISuccess> {
    return this.fixService.updateFix(dto, req, res);
  }
}
