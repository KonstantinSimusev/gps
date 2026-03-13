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

import { Account } from '../account/entities/account.entity';

import { AccountsRepository } from '../account/accounts.repository';
import { EmployeesRepository } from '../employees/employees.repository';
import { RolesRepository } from '../roles/roles.repository';
import { EmployeeRolesRepository } from '../employee-roles/employee-roles.repository';

import {
  ITokenOptions,
  IEmployee,
  ISuccess,
  IJwtPayload,
} from '../../shared/interfaces/api.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly accountsRepository: AccountsRepository,
    private readonly employeesRepository: EmployeesRepository,
    private readonly employeeRolesRepository: EmployeeRolesRepository,
    private readonly rolesRepository: RolesRepository,
  ) {}

  // === ПУБЛИЧНЫЕ МЕТОДЫ ===

  async login(
    login: string,
    password: string,
    res: Response,
  ): Promise<IEmployee> {
    // Проверка аккаунта
    const account = await this.accountsRepository.findAccountByLogin(login);

    if (!account) {
      throw new NotFoundException('Аккаунт не найден');
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
    this.setCookie(res, 'access_token', accessToken, 'ACCESS_TOKEN_EXPIRATION');

    // Генерируем refreshToken (UUID + соль)
    const refreshToken = uuidv4();
    const salt = await bcrypt.genSalt(10);

    // Хешируем refreshToken
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    // Обновили refreshToken в базе данных
    await this.accountsRepository.update(account.id, {
      hashedRefreshToken,
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
      throw new NotFoundException('Сотрудник не найден');
    }

    const employeeRole =
      await this.employeeRolesRepository.findEmployeeRoleByAccount(account.id);

    if (employeeRole) {
      return {
        ...employee,
        role: employeeRole.name,
        isActive: employeeRole.isActive,
      };
    }

    const role = await this.rolesRepository.findRoleByAccount(account.id);

    if (!role) {
      throw new UnauthorizedException('Роль отсутствует');
    }

    return {
      ...employee,
      role: role.name,
      isActive: true,
    };
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
      return;
    }

    const accounts =
      await this.accountsRepository.findAllByHashedRefreshToken();

    const account = await this.findAccountByRefreshToken(
      accounts,
      refreshToken,
    );

    if (account) {
      await this.accountsRepository.update(account.id, {
        hashedRefreshToken: null,
      });
    }
  }

  // === ПРИВАТНЫЕ МЕТОДЫ: РАБОТА С ТОКЕНАМИ ===

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

    return {
      message: 'Access token проверен успешно',
    };
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

      // Находим аккаунт сотрудника
      const account = await this.findAccountByRefreshToken(
        accounts,
        refreshToken,
      );

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

  private async getAccessToken(req: Request): Promise<string> {
    const accessToken = req.cookies.access_token;

    if (!accessToken || accessToken.trim() === '') {
      throw new UnauthorizedException('Access token отсутствует');
    }

    return accessToken;
  }

  private async findAccountByRefreshToken(
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

  // === ПРИВАТНЫЕ МЕТОДЫ: РАБОТА С КУКАМИ ===

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

  // === ПРИВАТНЫЕ МЕТОДЫ: РАБОТА С ДАННЫМИ ===

  // private toApiEmployee(employee: Employee): IEmployee {
  //   const { account, ...apiEmployee } = employee;

  //   return apiEmployee;
  // }
}
