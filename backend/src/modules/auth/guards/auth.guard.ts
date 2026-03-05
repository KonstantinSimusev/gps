import { Request, Response } from 'express';

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

import { AccountsRepository } from '../../account/accounts.repository';
import { EmployeesRepository } from '../../employees/employees.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly employeesRepository: EmployeesRepository,
    private readonly accountsRepository: AccountsRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    try {
      const savedAccessToken = this.getAccessToken(req);
      const decoded = this.jwtService.decode(savedAccessToken);

      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException(
          'Токен некорректен или отсутствует accountId',
        );
      }

      // Проверяем валидность access token с учётом срока действия
      this.jwtService.verify(savedAccessToken, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });

      return true; // Токен валиден — разрешаем доступ
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return this.handleExpiredAccessToken(req, res, error);
      }
      throw new UnauthorizedException('Требуется повторная авторизация');
    }
  }

  private async handleExpiredAccessToken(
    req: Request,
    res: Response,
    error: TokenExpiredError,
  ): Promise<boolean> {
    const decoded = this.jwtService.decode(req.cookies.access_token);
    const accountId = decoded?.sub;

    if (!accountId) {
      throw new UnauthorizedException('В токене отсутствует accountId');
    }

    const employee = await this.employeesRepository.findByAccountId(accountId);
    if (!employee) {
      throw new UnauthorizedException('Сотрудник не найден');
    }

    const dbRefreshToken = employee.account.refreshToken;
    if (!dbRefreshToken) {
      throw new UnauthorizedException('Refresh token не найден');
    }

    try {
      this.jwtService.verify(dbRefreshToken, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });
    } catch (refreshError) {
      await this.invalidateSession(res, accountId);
      throw new UnauthorizedException('Refresh token просрочен');
    }

    // Генерируем новый access token
    const accessToken = await this.jwtService.signAsync(
      { sub: employee.account.id, login: employee.account.login },
      {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: parseInt(
          this.configService.get('ACCESS_TOKEN_EXPIRATION'),
          10,
        ),
      },
    );

    this.setAccessToken(res, accessToken);
    return true; // Доступ разрешён после обновления токена
  }

  private getAccessToken(req: Request): string {
    const savedAccessToken = req.cookies.access_token;
    if (!savedAccessToken) {
      throw new UnauthorizedException('Access token не найден в cookies');
    }
    return savedAccessToken;
  }

  private setAccessToken(res: Response, accessToken: string): void {
    const expirationSeconds = parseInt(
      this.configService.get('ACCESS_TOKEN_EXPIRATION'),
      10,
    );
    const maxAgeInMs = expirationSeconds * 1000;

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: maxAgeInMs,
      path: '/',
    });
  }

  private async invalidateSession(
    res: Response,
    accountId: string,
  ): Promise<void> {
    this.clearCookies(res);
    await this.accountsRepository.update(accountId, { refreshToken: null });
  }

  private clearCookies(res: Response): void {
    res.cookie('access_token', '', {
      httpOnly: true,
      expires: new Date(0),
    });
  }
}
