import { Body, Controller, Put, Req, Res } from '@nestjs/common';

import { Request, Response } from 'express';

import { ProductionService } from './production.service';

import { UpdateProductionDTO } from './dto/update-production.dto';
import { ISuccess } from '../../shared/interfaces/api.interface';

@Controller('productions')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Put('update-production')
  async updateProduction(
    @Body() dto: UpdateProductionDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ISuccess> {
    return this.productionService.updateProduction(dto, req, res);
  }
}
