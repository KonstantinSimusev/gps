import * as bcrypt from 'bcrypt';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Response, Request } from 'express';

import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';

import { ISuccess, IUser } from '../../shared/interfaces/api.interface';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(login: string, password: string, res: Response): Promise<IUser> {
    try {
      // Поиск пользователя
      const user = await this.userRepository.findByLogin(login);

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      // Проверка пароля
      const isPasswordValid = await bcrypt.compare(
        password,
        user.hashedPassword,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Неверный пароль');
      }

      // Генерируем accessToken
      const accessToken = await this.jwtService.signAsync(
        { sub: user.id, login: user.login },
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
        { sub: user.id },
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          expiresIn: parseInt(
            this.configService.get('REFRESH_TOKEN_EXPIRATION'),
            10,
          ),
        },
      );

      // Обновили refreshToken в базе данных
      await this.userRepository.update(user, {
        refreshToken,
      });

      // Установили токен в куки
      this.setAccessToken(res, accessToken);

      // Убрали пароль, логин, токен
      const apiUser = this.transformUser(user);

      return apiUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'Произошла ошибка при авторизации',
      );
    }
  }

  async logout(req: Request, res: Response): Promise<ISuccess> {
    try {
      const savedAccessToken = await this.getAccessToken(req);

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

      const userId = decoded.sub;

      if (!userId) {
        throw new UnauthorizedException('В токене отсутствует поле userId');
      }

      // Находим пользователя в базе
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new UnauthorizedException('Пользователь не найден');
      }

      // Удаляем токен из куки
      this.clearCookies(res);

      // Очищаем токен в бд
      await this.userRepository.update(user, {
        refreshToken: null,
      });

      return {
        message: 'Успешный выход из системы',
      };
    } catch {
      // Удаляем токен из куки
      this.clearCookies(res);

      throw new InternalServerErrorException(
        'Ошибка при обновлении данных пользователя',
      );
    }
  }

  async validateAccessToken(req: Request, res: Response): Promise<IUser> {
    let userId: string | undefined;

    try {
      const savedAccessToken = await this.getAccessToken(req);

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

      userId = decoded.sub;

      if (!userId) {
        throw new UnauthorizedException('В токене отсутствует поле userId');
      }

      // Находим пользователя в базе
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new UnauthorizedException('Пользователь не найден');
      }

      // Проверяем валидность токена с учетом срока действия
      const accessDecoded = this.jwtService.verify(savedAccessToken, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });

      if (!accessDecoded) {
        throw new UnauthorizedException('Access token истек');
      }

      // Генерируем новый access token
      const accessToken = await this.jwtService.signAsync(
        { sub: user.id, login: user.login },
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

      // Убрали пароль, логин, токен
      const apiUser = this.transformUser(user);

      return apiUser;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // Находим пользователя в базе
        const user = await this.userRepository.findById(userId);

        if (!user) {
          throw new UnauthorizedException('Пользователь не найден');
        }

        const dbRefreshToken = user.refreshToken;

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

          // Очищаем токен в бд
          await this.userRepository.update(user, {
            refreshToken: null,
          });

          throw new UnauthorizedException('Refresh token просрочен');
        }

        // Генерируем новый access token
        const accessToken = await this.jwtService.signAsync(
          { sub: user.id, login: user.login },
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

        // Убрали пароль, логин, токен
        const apiUser = this.transformUser(user);

        return apiUser;
      }

      // Удаляем токен из куки
      this.clearCookies(res);

      throw new UnauthorizedException('Требуется повторная авторизация');
    }
  }

  async getAccessToken(req: Request): Promise<string> {
    const savedAccessToken = req.cookies.access_token;

    if (!savedAccessToken) {
      throw new UnauthorizedException('Access token не найден в cookies');
    }

    return savedAccessToken;
  }

  async setAccessToken(res: Response, accessToken: string): Promise<void> {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });
  }

  async clearCookies(res: Response): Promise<void> {
    res.cookie('access_token', '', {
      httpOnly: true,
      expires: new Date(0),
    });
  }

  private transformUser(user: User): IUser {
    const { login, hashedPassword, refreshToken, ...apiUser } = user;
    return apiUser;
  }
}
