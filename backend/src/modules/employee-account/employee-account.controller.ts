import { Controller, Param, Put, Req, UseGuards } from '@nestjs/common';

import { Request } from 'express';

import { AuthGuard } from '../auth/guards/auth.guard';

import { EmployeeIdDto } from './dto/employee-id.dto';
import { IAccountInfo, IProfile } from '../../shared/interfaces/api.interface';

import { EmployeeAccountService } from './employee-account.service';

@Controller('employee-account')
export class EmployeeAccountController {
  constructor(
    private readonly employeeAccountService: EmployeeAccountService,
  ) {}

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateLoginAndPassword(
    @Param() dto: EmployeeIdDto,
    @Req() req: Request & { profile: IProfile },
  ): Promise<IAccountInfo> {
    return this.employeeAccountService.updateLoginAndPassword(
      dto.id,
      req.profile.workshopCode,
    );
  }
}
