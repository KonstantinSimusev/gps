import * as bcrypt from 'bcrypt';

import { Response, Request } from 'express';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

import { Employee } from '../employees/entities/employee.entity';

import { AccountsRepository } from '../account/accounts.repository';
import { EmployeesRepository } from '../employees/employees.repository';

import { IEmployee, ISuccess } from '../../shared/interfaces/api.interface';

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

      if (!account.id) {
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
      const accessToken = await this.jwtService.signAsync(
        { sub: account.id, login: account.login },
        {
          secret: this.configService.get('ACCESS_TOKEN_SECRET'),
          expiresIn: parseInt(
            this.configService.get('ACCESS_TOKEN_EXPIRATION'),
            10,
          ),
        },
      );

      // Генерируем refreshToken
      const refreshToken = await this.jwtService.signAsync(
        { sub: account.id },
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          expiresIn: parseInt(
            this.configService.get('REFRESH_TOKEN_EXPIRATION'),
            10,
          ),
        },
      );

      // Обновили refreshToken в базе данных
      await this.accountsRepository.update(account.id, {
        refreshToken,
      });

      // Установили токен в куки
      this.setAccessToken(res, accessToken);

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
      const savedAccessToken = this.getAccessToken(req);

      // Проверяем, что токен не пустой
      if (!savedAccessToken) {
        throw new UnauthorizedException('Токен отсутствует');
      }

      // Декодируем токен без проверки срока действия
      const decoded = this.jwtService.decode(savedAccessToken);

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
      this.clearCookies(res);

      // Очищаем refreshToken в базе данных
      await this.accountsRepository.update(accountId, {
        refreshToken: null,
      });

      return {
        message: 'Успешный выход из системы',
      };
    } catch {
      // Всегда удаляем куки при любой ошибке — пользователь должен быть разлогинен
      this.clearCookies(res);

      throw new InternalServerErrorException(
        'Ошибка при выходе сотрудника из системы',
      );
    }
  }

  async validateAccessToken(req: Request, res: Response): Promise<ISuccess> {
    let accountId: string | undefined;

    try {
      const savedAccessToken = this.getAccessToken(req);

      // Проверяем, что токен не пустой
      if (!savedAccessToken) {
        throw new UnauthorizedException('Токен отсутствует');
      }

      // Декодируем токен без проверки срока действия
      const decoded = this.jwtService.decode(savedAccessToken);

      // Проверяем результат декодирования
      if (!decoded) {
        throw new UnauthorizedException('Ошибка декодирования токена');
      }

      accountId = decoded.sub;

      if (!accountId) {
        throw new UnauthorizedException('В токене отсутствует accountId');
      }

      // Проверяем валидность токена с учетом срока действия
      const accessDecoded = this.jwtService.verify(savedAccessToken, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });

      if (!accessDecoded) {
        throw new UnauthorizedException('Access token истек');
      }

      return {
        message: 'Access token проверен',
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // Находим сотрудника в базе
        const employee =
          await this.employeesRepository.findByAccountId(accountId);

        if (!employee) {
          throw new UnauthorizedException('Сотрудник не найден');
        }

        const dbRefreshToken = employee.account.refreshToken;

        if (!dbRefreshToken) {
          throw new UnauthorizedException('Refresh token не найден');
        }

        try {
          // Проверяем срок жизни refreshToken
          const refreshDecoded = this.jwtService.verify(dbRefreshToken, {
            secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          });

          if (!refreshDecoded) {
            throw new UnauthorizedException('Refresh token просрочен');
          }
        } catch {
          // Удаляем токен из куки
          this.clearCookies(res);

          // Очищаем refreshToken в базе данных
          await this.accountsRepository.update(accountId, {
            refreshToken: null,
          });

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

        // Установили токен в куки
        this.setAccessToken(res, accessToken);

        return {
          message: 'Access token обновлен',
        };
      }

      // Удаляем токен из куки
      this.clearCookies(res);

      throw new UnauthorizedException('Требуется повторная авторизация');
    }
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

    // конвертируем секунды в миллисекунды
    const maxAgeInMs = expirationSeconds * 1000;

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: maxAgeInMs, // срок жизни куки в миллисекундах
      path: '/',
    });
  }

  private clearCookies(res: Response): void {
    res.cookie('access_token', '', {
      httpOnly: true,
      expires: new Date(0),
    });
  }

  private toApiEmployee(employee: Employee): IEmployee {
    const { account, ...apiEmployee } = employee;

    return apiEmployee;
  }
}
