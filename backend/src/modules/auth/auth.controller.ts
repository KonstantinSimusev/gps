import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';

import { Response, Request } from 'express';

import { AuthGuard } from './guards/auth.guard';

import { AuthDto } from './dto/auth.dto';
import { IProfile, ISuccess } from '../../shared/interfaces/api.interface';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IProfile> {
    return this.authService.login(dto.login, dto.password, res);
  }

  @Post('profile')
  @UseGuards(AuthGuard)
  async checkAccessToken(
    @Req() req: Request & { profile: IProfile },
  ): Promise<IProfile> {
    return req.profile;
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ISuccess> {
    return this.authService.logout(req, res);
  }
}
