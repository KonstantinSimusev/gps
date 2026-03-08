import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';

import { Response, Request } from 'express';

import { AuthDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

import { IEmployee, ISuccess } from '../../shared/interfaces/api.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: AuthDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IEmployee> {
    return this.authService.login(dto.login, dto.password, res);
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ISuccess> {
    return this.authService.logout(req, res);
  }

  @Post('token')
  @UseGuards(AuthGuard)
  async checkAccessToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ISuccess> {
    return this.authService.checkAccessToken(req, res);
  }
}
