import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
} from '@nestjs/common';

import { Response, Request } from 'express';

import { ShiftService } from './shift.service';
import { UserShiftService } from '../user-shift/user-shift.service';
import { ProductionService } from '../production/production.service';
import { ShipmentService } from '../shipment/shipment.service';
import { PackService } from '../pack/pack.service';
import { FixService } from '../fix/fix.service';
import { ResidueService } from '../residue/residue.service';

import { CreateShiftDTO } from './dto/create-shift.dto';

import {
  IFix,
  IList,
  IPack,
  IProduction,
  IShift,
  IShipment,
  ISuccess,
  IUserShift,
} from '../../shared/interfaces/api.interface';

@Controller('shifts')
export class ShiftController {
  constructor(
    private readonly shiftService: ShiftService,
    private readonly userShiftService: UserShiftService,
    private readonly productionService: ProductionService,
    private readonly shipmentService: ShipmentService,
    private readonly packService: PackService,
    private readonly fixService: FixService,
    private readonly residueService: ResidueService,
  ) {}

  @Post('create-shift')
  async createShift(
    @Body() dto: CreateShiftDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ISuccess> {
    return this.shiftService.createShift(dto, req, res);
  }

  @Get('active-shift')
  async getActiveShift(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IShift> {
    return this.shiftService.getActiveShift(req, res);
  }

  @Get('finished-shift')
  async getFinishedShift(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IShift> {
    return this.shiftService.getFinishedShift(req, res);
  }

  @Get('last-team-shift')
  async getLastTeamShift(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IShift | null> {
    return this.shiftService.getLastTeamShift(req, res);
  }

  @Get('last-shifts-teams')
  async getLastShiftsTeams(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IList<IShift>> {
    return this.shiftService.getLastShiftsTeams(req, res);
  }

  @Get(':shiftId/users-shifts')
  async getUsersShifts(
    @Param('shiftId', ParseUUIDPipe) shiftId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IList<IUserShift>> {
    return this.userShiftService.getUsersShifts(shiftId, req, res);
  }

  @Get(':shiftId/productions')
  async getProductions(
    @Param('shiftId', ParseUUIDPipe) shiftId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IList<IProduction>> {
    return this.productionService.getProductions(shiftId, req, res);
  }

  @Get(':shiftId/shipments')
  async getShipments(
    @Param('shiftId', ParseUUIDPipe) shiftId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IList<IShipment>> {
    return this.shipmentService.getShipments(shiftId, req, res);
  }

  @Get(':shiftId/packs')
  async getPacks(
    @Param('shiftId', ParseUUIDPipe) shiftId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IList<IPack>> {
    return this.packService.getPacks(shiftId, req, res);
  }

  @Get(':shiftId/fixs')
  async getFixs(
    @Param('shiftId', ParseUUIDPipe) shiftId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IList<IFix>> {
    return this.fixService.getFixs(shiftId, req, res);
  }

  @Get(':shiftId/residues')
  async getResidues(
    @Param('shiftId', ParseUUIDPipe) shiftId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IList<IPack>> {
    return this.residueService.getResidues(shiftId, req, res);
  }
}
