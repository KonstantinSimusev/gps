import { Body, Controller, Post, Req, Res } from '@nestjs/common';

import { Response, Request } from 'express';

import { AuthService } from './auth.service';

import { LoginDTO } from './dto/login.dto';
import { ISuccess, IUser } from '../../shared/interfaces/api.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUser> {
    return await this.authService.login(dto.login, dto.password, res);
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ISuccess> {
    return await this.authService.logout(req, res);
  }

  @Post('token')
  async checkAccessToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUser> {
    return await this.authService.validateAccessToken(req, res);
  }
}
