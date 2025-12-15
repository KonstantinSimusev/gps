import { Body, Controller, Put, Req, Res } from '@nestjs/common';

import { Request, Response } from 'express';

import { ResidueService } from './residue.service';

import { UpdateResidueDTO } from './dto/update-residue.dto';
import { ISuccess } from '../../shared/interfaces/api.interface';

@Controller('residues')
export class ResidueController {
  constructor(private readonly residueService: ResidueService) {}

  @Put('update-residue')
  async updateResidue(
    @Body() dto: UpdateResidueDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ISuccess> {
    return this.residueService.updateResidue(dto, req, res);
  }
}
