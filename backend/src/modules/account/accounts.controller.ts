import {
  Controller,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { AuthGuard } from '../auth/guards/auth.guard';

import { EmployeeIdDTO } from '../employees/dto/employee-id.dto';
import { AccountsService } from './accounts.service';

import { IProfile, IAccountInfo } from '../../shared/interfaces/api.interface';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateLoginAndPassword(
    @Param() dto: EmployeeIdDTO,
    @Req() req: Request & { profile: IProfile },
  ): Promise<IAccountInfo> {
    return this.accountsService.updateLoginAndPassword(
      dto.id,
      req.profile.workshopCode,
    );
  }
}
