import { Body, Controller, Put, Req, Res } from '@nestjs/common';

import { Request, Response } from 'express';

import { ShipmentService } from './shipment.service';

import { ISuccess } from '../../shared/interfaces/api.interface';
import { UpdateShipmentDTO } from './dto/update-shipment.dto';

@Controller('shipments')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Put('update-shipment')
  async updateShipment(
    @Body() dto: UpdateShipmentDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ISuccess> {
    return this.shipmentService.updateShipment(dto, req, res);
  }
}
