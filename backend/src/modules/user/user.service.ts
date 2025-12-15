import * as bcrypt from 'bcrypt';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { Response, Request } from 'express';

import { User } from './entities/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { AuthService } from '../auth/auth.service';

import {
  IList,
  IProfession,
  ISuccess,
  IUser,
} from '../../shared/interfaces/api.interface';

import { getProfessionCounts } from '../../shared/utils/utils';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  // CRUD
  async createUser(dto: CreateUserDTO): Promise<ISuccess> {
    try {
      // Генерируем соль и хешируем пароль
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dto.password, salt);

      // Создаем нового пользователя
      // Используем spread-оператор для копирования всех полей из DTO
      // Добавляем хешированный пароль в объект
      const newUser = {
        ...dto, // Копируем все поля из входящего DTO (login, password, profession)
        hashedPassword: hashedPassword, // Перезаписываем NULL на хешированный пароль
      };

      // Преобразуем простой объект в экземпляр сущности User
      // plainToInstance - это функция из библиотеки class-transformer
      // Она помогает преобразовать обычный объект в полноценный экземпляр класса
      // с учетом всех декораторов и валидаций из сущности TypeORM
      const user = plainToInstance(User, newUser);

      await this.userRepository.create(user);

      return {
        message: 'Пользователь успешно создан',
      };
    } catch (error) {
      throw new BadRequestException('Некорректные данные для регистрации');
    }
  }

  async createUsers(dto: CreateUserDTO[]): Promise<ISuccess> {
    try {
      if (!dto || dto.length === 0) {
        throw new BadRequestException(
          'Массив пользователей не может быть пустым',
        );
      }

      await Promise.all(dto.map((user) => this.createUser(user)));

      return {
        message: 'Пользователи успешно созданы',
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Произошла ошибка при создании пользователей',
      );
    }
  }

  async getUsers() // @Req() req: Request,
  // @Res({ passthrough: true }) res: Response,
  : Promise<IList<IUser>> {
    try {
      // await this.authService.validateAccessToken(req, res);
      const users = await this.userRepository.findAll();
      const apiUsers = users.map(this.transformUser);

      return {
        total: apiUsers.length,
        items: apiUsers,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Произошла ошибка при получении списка пользователей',
      );
    }
  }

  async getProfessions(
    req: Request,
    res: Response,
  ): Promise<IList<IProfession>> {
    await this.authService.validateAccessToken(req, res);

    const LPC11Users = await this.userRepository.findLPC11All();
    const professions = getProfessionCounts(LPC11Users);

    return {
      total: professions.length,
      items: professions,
    };
  }

  async getUser(id: string): Promise<IUser> {
    try {
      const user = await this.userRepository.findById(id);

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      const apiUser = this.transformUser(user);

      return apiUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'Произошла ошибка при получении пользователя',
      );
    }
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<ISuccess> {
    try {
      const user = await this.userRepository.findById(id);

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      const updateUser = await this.userRepository.update(user, updateData);

      if (!updateUser) {
        throw new NotFoundException('Пользователь не обновлен');
      }

      return {
        message: 'Пользователь успешно обновлен',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Произошла ошибка при обновлении пользователя',
      );
    }
  }

  async deleteUser(id: string): Promise<ISuccess> {
    try {
      const user = await this.userRepository.findById(id);

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      await this.userRepository.delete(id);

      return {
        message: 'Пользователь успешно удален',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Произошла ошибка при удалении пользователя',
      );
    }
  }

  private transformUser(user: User): IUser {
    const { login, hashedPassword, refreshToken, ...apiUser } = user;
    return apiUser;
  }
}
