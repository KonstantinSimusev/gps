import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Response } from 'express';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    try {
      const profile = await this.authService.checkAccessToken(
        request,
        response,
      );

      request.profile = profile;

      return true;
    } catch (error) {
      // Очищаем куки при любой ошибке авторизации
      this.clearCookies(response, 'access_token');
      this.clearCookies(response, 'refresh_token');

      throw new UnauthorizedException('Требуется авторизация');
    }
  }

  private clearCookies(res: Response, cookieName: string): void {
    res.cookie(cookieName, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/',
    });
  }
}
