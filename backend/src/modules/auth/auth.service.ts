import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { Response, Request } from 'express';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Employee } from '../employees/entities/employee.entity';

import { AccountsRepository } from '../account/accounts.repository';
import { EmployeesRepository } from '../employees/employees.repository';

import {
  ITokenOptions,
  IEmployee,
  ISuccess,
  IJwtPayload,
} from '../../shared/interfaces/api.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly accountsRepository: AccountsRepository,
    private readonly employeesRepository: EmployeesRepository,
  ) {}

  async login(
    login: string,
    password: string,
    res: Response,
  ): Promise<IEmployee> {
    try {
      // Проверка аккаунта
      const account = await this.accountsRepository.findByLogin(login);

      if (!account) {
        throw new NotFoundException('Аккаунт не найден');
      }

      if (!account.hashedPassword) {
        throw new InternalServerErrorException(
          'Ошибка сервера: отсутствует хешированный пароль',
        );
      }

      // Проверка пароля
      const isPasswordValid = await bcrypt.compare(
        password,
        account.hashedPassword,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Неверный пароль');
      }

      // Генерируем accessToken
      const accessToken = await this.generateToken({
        payload: { sub: account.id },
        secretKey: 'ACCESS_TOKEN_SECRET',
        expiresInKey: 'ACCESS_TOKEN_EXPIRATION',
      });

      // Устанавливаем accessToken в куки
      this.setCookie(
        res,
        'access_token',
        accessToken,
        'ACCESS_TOKEN_EXPIRATION',
      );

      // Генерируем refreshToken (UUID + соль)
      const refreshToken = uuidv4();
      const salt = await bcrypt.genSalt(10);

      // Хешируем refreshToken
      const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

      // Обновили refreshToken в базе данных
      await this.accountsRepository.update(account.id, {
        hashedRefreshToken,
      });

      // Установили токен куки
      this.setCookie(
        res,
        'refresh_token',
        refreshToken,
        'REFRESH_TOKEN_EXPIRATION',
      );

      // Ищем сотрудника по accountId
      const employee = await this.employeesRepository.findByAccountId(
        account.id,
      );

      if (!employee) {
        throw new NotFoundException('Сотрудник не найден');
      }

      const apiEmployee = this.toApiEmployee(employee);

      return apiEmployee;
    } catch (error) {
      throw new InternalServerErrorException(
        'Произошла ошибка при авторизации',
      );
    }
  }

  async logout(req: Request, res: Response): Promise<ISuccess> {
    try {
      // Получаем токен
      const accessToken = await this.getAccessToken(req);

      // Декодируем токен без проверки срока действия
      const decoded = this.jwtService.decode(accessToken);

      // Проверяем результат декодирования
      if (!decoded) {
        throw new UnauthorizedException('Ошибка декодирования токена');
      }

      const accountId = decoded.sub;

      if (!accountId) {
        throw new UnauthorizedException('В токене отсутствует accountId');
      }

      // Ищем сотрудника по accountId
      const employee =
        await this.employeesRepository.findByAccountId(accountId);

      // Проверяем, что сотрудник найден
      if (!employee) {
        throw new NotFoundException('Сотрудник не найден');
      }

      // Проверяем, что у сотрудника есть связанный аккаунт
      if (!employee.account) {
        throw new UnauthorizedException(
          'У сотрудника отсутствует связанный аккаунт',
        );
      }

      // Удаляем токен из куки
      this.clearCookies(res, 'access_token');
      this.clearCookies(res, 'refresh_token');

      // Очищаем refreshToken в базе данных
      await this.accountsRepository.update(accountId, {
        hashedRefreshToken: null,
      });

      return {
        message: 'Успешный выход из системы',
      };
    } catch {
      // Всегда удаляем куки при любой ошибке — пользователь должен быть разлогинен
      this.clearCookies(res, 'access_token');
      this.clearCookies(res, 'refresh_token');

      await this.invalidateRefreshToken(req);

      throw new InternalServerErrorException(
        'Ошибка при выходе сотрудника из системы',
      );
    }
  }

  async checkAccessToken(req: Request, res: Response): Promise<ISuccess> {
    try {
      // Сначала пробуем проверить access token
      return await this.validateAccessToken(req);
    } catch (error) {
      try {
        // Если access token истёк — пробуем обновить
        return await this.refreshAccessToken(req, res);
      } catch (error) {
        // При ошибке обновления токена обнуляем refreshToken в базе
        await this.invalidateRefreshToken(req);
        throw new UnauthorizedException('Требуется авторизация');
      }
    }
  }

  private async validateAccessToken(req: Request): Promise<ISuccess> {
    const accessToken = await this.getAccessToken(req);

    // Проверяем токен (подпись и срок действия), возвращаем обьект payload
    const decoded = this.jwtService.verify<IJwtPayload>(accessToken, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
    });

    const accountId = decoded.sub;

    if (!accountId) {
      throw new UnauthorizedException(
        'Обязательное поле sub в payload JWT-токена отсутствует или пусто',
      );
    }

    // Ищем сотрудника по accountId
    const employee = await this.employeesRepository.findByAccountId(accountId);

    if (!employee) {
      throw new NotFoundException('Сотрудник не найден');
    }

    return {
      message: 'Access token проверен успешно',
    };
  }

  private async getAccessToken(req: Request): Promise<string> {
    const accessToken = req.cookies.access_token;

    if (!accessToken || accessToken.trim() === '') {
      throw new UnauthorizedException('Access token отсутствует');
    }

    return accessToken;
  }

  private async refreshAccessToken(
    req: Request,
    res: Response,
  ): Promise<ISuccess> {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken || refreshToken.trim() === '') {
        throw new UnauthorizedException('Refresh token отсутствует');
      }

      // Получаем все аккаунты с установленным hashedRefreshToken
      const accounts =
        await this.accountsRepository.findAllByHashedRefreshToken();

      let account = null;

      // Проходим по всем аккаунтам и проверяем токен
      for (const acc of accounts) {
        const isValid = await bcrypt.compare(
          refreshToken,
          acc.hashedRefreshToken,
        );

        if (isValid) {
          account = acc;
          break;
        }
      }

      if (!account) {
        throw new UnauthorizedException('Неверный refresh token');
      }

      // Генерируем новый accessToken
      const newAccessToken = await this.generateToken({
        payload: { sub: account.id },
        secretKey: 'ACCESS_TOKEN_SECRET',
        expiresInKey: 'ACCESS_TOKEN_EXPIRATION',
      });

      // Устанавливаем accessToken в куки
      this.setCookie(
        res,
        'access_token',
        newAccessToken,
        'ACCESS_TOKEN_EXPIRATION',
      );

      return {
        message: 'Access token успешно обновлен',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        // Пробрасываем ошибку дальше без изменений
        throw error;
      }

      // Для любых других ошибок или неожиданных исключений
      throw new UnauthorizedException('Ошибка при обновлении токена');
    }
  }

  async invalidateRefreshToken(req: Request): Promise<void> {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return;

    const accounts =
      await this.accountsRepository.findAllByHashedRefreshToken();

    for (const acc of accounts) {
      const isValid = await bcrypt.compare(
        refreshToken,
        acc.hashedRefreshToken,
      );

      if (isValid) {
        await this.accountsRepository.update(acc.id, {
          hashedRefreshToken: null,
        });

        break;
      }
    }
  }

  private async generateToken(
    options: ITokenOptions<IJwtPayload>,
  ): Promise<string> {
    const secret = this.configService.get(options.secretKey);

    const expiresIn = parseInt(
      this.configService.get(options.expiresInKey),
      10,
    );

    if (!secret) {
      throw new Error(`Secret not found: ${options.secretKey}`);
    }

    if (isNaN(expiresIn)) {
      throw new Error(`Invalid expiresIn: ${options.expiresInKey}`);
    }

    return this.jwtService.signAsync(options.payload, { secret, expiresIn });
  }

  private setCookie(
    res: Response,
    name: string,
    value: string,
    expirationConfigKey: string,
  ): void {
    const expirationSeconds = parseInt(
      this.configService.get(expirationConfigKey),
      10,
    );

    res.cookie(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: expirationSeconds * 1000, // конвертируем секунды в миллисекунды
      path: '/',
    });
  }

  private clearCookies(res: Response, cookieName: string): void {
    res.cookie(cookieName, '', {
      httpOnly: true,
      expires: new Date(0),
    });
  }

  private toApiEmployee(employee: Employee): IEmployee {
    const { account, ...apiEmployee } = employee;

    return apiEmployee;
  }
}
