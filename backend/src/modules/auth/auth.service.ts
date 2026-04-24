import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { Response, Request } from 'express';

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Account } from '../accounts/entities/account.entity';

import {
  ITokenOptions,
  IProfile,
  ISuccess,
  IJwtPayload,
} from '../../shared/interfaces/api.interface';

import { AccountsRepository } from '../accounts/accounts.repository';
import { EmployeeRolesRepository } from '../employee-roles/employee-roles.repository';
import { EmployeesRepository } from '../employees/employees.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly accountsRepository: AccountsRepository,
    private readonly employeesRepository: EmployeesRepository,
    private readonly employeeRolesRepository: EmployeeRolesRepository,
  ) {}

  async login(
    login: string,
    password: string,
    res: Response,
  ): Promise<IProfile> {
    // Проверка аккаунта
    const account = await this.accountsRepository.findByLogin(login);

    if (!account) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(
      password,
      account.hashedPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const employeeRole =
      await this.employeeRolesRepository.findEmployeeRoleByAccount(account.id);

    if (!employeeRole) {
      throw new UnauthorizedException('Ошибка авторизации'); // Роль в бд null;
    }

    // Генерируем accessToken
    const accessToken = await this.generateToken({
      payload: { sub: account.id },
      secretKey: 'ACCESS_TOKEN_SECRET',
      expiresInKey: 'ACCESS_TOKEN_EXPIRATION',
    });

    // Устанавливаем accessToken в куки
    this.setCookie(res, 'access_token', accessToken, 'ACCESS_TOKEN_EXPIRATION');

    // Генерируем refreshToken (UUID + соль)
    const refreshToken = uuidv4();
    const salt = await bcrypt.genSalt(10);

    // Хешируем refreshToken
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    // Обновили refreshToken в базе данных
    await this.accountsRepository.update(account.id, {
      hashedRefreshToken: hashedRefreshToken,
    });

    // Установили refreshToken в куки
    this.setCookie(
      res,
      'refresh_token',
      refreshToken,
      'REFRESH_TOKEN_EXPIRATION',
    );

    const employee = await this.employeesRepository.findEmployeeByAccount(
      account.id,
    );

    if (!employee) {
      throw new UnauthorizedException('Сотрудник не найден');
    }

    return {
      ...employee,
      roleId: employeeRole.id,
      role: employeeRole.role.name,
    };
  }

  async checkAccessToken(req: Request, res: Response): Promise<IProfile> {
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

  async logout(req: Request, res: Response): Promise<ISuccess> {
    try {
      // Сначала аннулируем refreshToken в базе данных
      await this.invalidateRefreshToken(req);

      // Потом удаляем токены из куки
      this.clearCookies(res, 'access_token');
      this.clearCookies(res, 'refresh_token');

      return {
        message: 'Успешный выход из системы',
      };
    } catch (error) {
      // Всегда удаляем куки при любой ошибке — пользователь должен быть разлогинен
      this.clearCookies(res, 'access_token');
      this.clearCookies(res, 'refresh_token');

      throw new InternalServerErrorException(
        'Ошибка при выходе сотрудника из системы',
      );
    }
  }

  async invalidateRefreshToken(req: Request): Promise<void> {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      // Console.log
      // console.log('Больше 30 сек или вышел');

      return;
    }

    const accounts = await this.accountsRepository.findByHashedRefreshToken();

    const account = await this.findAccountByRefreshToken(
      accounts,
      refreshToken,
    );

    if (account) {
      // Console.log
      // console.log('Вышел');

      await this.accountsRepository.update(account.id, {
        hashedRefreshToken: null,
      });
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

  private async validateAccessToken(req: Request): Promise<IProfile> {
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

    const employeeRole =
      await this.employeeRolesRepository.findEmployeeRoleByAccount(accountId);

    if (!employeeRole) {
      throw new UnauthorizedException('Роль отсутствует');
    }

    const employee =
      await this.employeesRepository.findEmployeeByAccount(accountId);

    if (!employee) {
      throw new NotFoundException('Сотрудник не найден');
    }

    // Console.log
    // console.log('До 10 сек');

    return {
      ...employee,
      roleId: employeeRole.id,
      role: employeeRole.role.name,
    };
  }

  private async refreshAccessToken(
    req: Request,
    res: Response,
  ): Promise<IProfile> {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken || refreshToken.trim() === '') {
        throw new UnauthorizedException('Refresh token отсутствует');
      }

      // Получаем все аккаунты с установленным hashedRefreshToken
      const accounts = await this.accountsRepository.findByHashedRefreshToken();

      // Находим аккаунт сотрудника
      const account = await this.findAccountByRefreshToken(
        accounts,
        refreshToken,
      );

      if (!account) {
        throw new UnauthorizedException('Неверный refresh token');
      }

      const employeeRole =
        await this.employeeRolesRepository.findEmployeeRoleByAccount(
          account.id,
        );

      if (!employeeRole) {
        throw new UnauthorizedException('Роль отсутствует');
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

      const employee = await this.employeesRepository.findEmployeeByAccount(
        account.id,
      );

      if (!employee) {
        throw new NotFoundException('Сотрудник не найден');
      }

      // Console.log
      // console.log('10-30 сек');

      return {
        ...employee,
        roleId: employeeRole.id,
        role: employeeRole.role.name,
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

  async getAccessToken(req: Request): Promise<string> {
    const accessToken = req.cookies.access_token;

    if (!accessToken || accessToken.trim() === '') {
      throw new UnauthorizedException('Access token отсутствует');
    }

    return accessToken;
  }

  async findAccountByRefreshToken(
    accounts: Account[],
    refreshToken: string,
  ): Promise<Account | null> {
    for (const account of accounts) {
      const isValid = await bcrypt.compare(
        refreshToken,
        account.hashedRefreshToken,
      );

      if (isValid) {
        return account;
      }
    }

    return null;
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
}
