import {
  Body,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Response, Request } from 'express';

import { User } from '../user/entities/user.entity';
import { Shift } from '../shift/entities/shift.entity';
import { UserShift } from './entities/user-shift.entity';

import { AuthService } from '../auth/auth.service';
import { UserRepository } from '../user/user.repository';
import { ShiftRepository } from '../shift/shift.repository';
import { UserShiftRepository } from './user-shift.repository';

import { AddUserShiftDTO } from './dto/add-user-shift.dto';
import { UpdateUserShiftDTO } from './dto/update-user-shift.dto';

import {
  IList,
  ISuccess,
  IUserShift,
} from '../../shared/interfaces/api.interface';

import { EProfession, ETeamProfession } from '../../shared/enums/enums';

@Injectable()
export class UserShiftService {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly userShiftRepository: UserShiftRepository,
    private readonly shiftRepository: ShiftRepository,
  ) {}

  async creatUserShift(
    dto: AddUserShiftDTO,
    req: Request,
    res: Response,
  ): Promise<IUserShift> {
    try {
      await this.authService.validateAccessToken(req, res);

      const shift = await this.shiftRepository.findById(dto.shiftId);

      if (!shift) {
        throw new NotFoundException('Смена не найдена');
      }

      const user = await this.userRepository.findUserByPersonalNumber(
        dto.personalNumber,
      );

      if (!user) {
        throw new NotFoundException('Работник не найден');
      }

      // Получаем все допустимые профессии из enum
      const validProfessions: string[] = Object.values(ETeamProfession);

      // Проверяем, указана ли профессия пользователя в допустимом списке
      if (!user.profession) {
        throw new Error('Профессия пользователя не указана');
      }

      if (!validProfessions.includes(user.profession)) {
        throw new ConflictException('Профессия недоступна');
      }

      // Проверяем, существует ли уже запись "пользователь + смена"
      const isExisting = await this.userShiftRepository.existsByUserAndShift(
        user.id,
        shift.id,
      );

      if (isExisting) {
        throw new ConflictException('Работник уже создан');
      }

      const createdUserShift = this.createUserShiftEntity(user, shift);

      const userShift = await this.userShiftRepository.create(createdUserShift);

      return userShift;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Ошибка при создании смены пользователя',
      );
    }
  }

  async createUsersShifts(shift: Shift, users: User[]): Promise<UserShift[]> {
    try {
      return await Promise.all(
        users.map((user) => {
          const createdUserShift = this.createUserShiftEntity(user, shift);
          return this.userShiftRepository.create(createdUserShift);
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при создании смены');
    }
  }

  async getUsersShifts(
    shiftId: string,
    req: Request,
    res: Response,
  ): Promise<IList<IUserShift>> {
    try {
      await this.authService.validateAccessToken(req, res);

      const usersShifts =
        await this.userShiftRepository.findUsersShiftsByShiftId(shiftId);

      return {
        total: usersShifts.length,
        items: usersShifts,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Ошибка при получении списка смен',
      );
    }
  }

  async updateUserShift(
    dto: UpdateUserShiftDTO,
    req: Request,
    res: Response,
  ): Promise<ISuccess> {
    try {
      await this.authService.validateAccessToken(req, res);

      const userShift = await this.userShiftRepository.findById(dto.id);

      if (!userShift) {
        throw new NotFoundException('Смена не найдена');
      }

      const updateUserShift = await this.userShiftRepository.update(
        userShift,
        dto,
      );

      if (!updateUserShift) {
        throw new NotFoundException('Смена не обновлена');
      }

      return {
        message: 'Смена пользователя успешно обновлена',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Произошла ошибка при обновлении смены',
      );
    }
  }

  async deleteUserShift(
    id: string,
    req: Request,
    res: Response,
  ): Promise<ISuccess> {
    try {
      await this.authService.validateAccessToken(req, res);

      const userShift = await this.userShiftRepository.findById(id);

      if (!userShift) {
        throw new NotFoundException('Смена не найдена');
      }

      await this.userShiftRepository.delete(id);

      return {
        message: 'Смена успешно удалена',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Произошла ошибка при удалении смены',
      );
    }
  }

  private createUserShiftEntity(
    user: User,
    shift: Shift,
    workStatus: string = 'Явка',
    workPlace: string = 'Не выбрано',
    workHours: number = 11.5,
  ): UserShift {
    const userShift = new UserShift();

    userShift.workStatus = workStatus;
    userShift.workPlace = workPlace;
    userShift.shiftProfession = user.profession;

    // Проверяем, содержит ли профессия подстроку 'ЛУМ'
    if (
      user.profession === EProfession.OPERATOR ||
      user.profession === EProfession.PACKER_LUM
    ) {
      userShift.workHours = 12;
    } else {
      userShift.workHours = workHours; // Используем значение по умолчанию (11.5) или переданное в параметре
    }

    userShift.user = user;
    userShift.shift = shift;
    return userShift;
  }
}
