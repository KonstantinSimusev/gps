import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Response, Request } from 'express';

import { Shift } from './entities/shift.entity';

import { AuthService } from '../auth/auth.service';

import { UserRepository } from '../user/user.repository';
import { ShiftRepository } from './shift.repository';
import { UserShiftService } from '../user-shift/user-shift.service';
import { ProductionService } from '../production/production.service';
import { ShipmentService } from '../shipment/shipment.service';
import { PackService } from '../pack/pack.service';
import { FixService } from '../fix/fix.service';
import { ResidueService } from '../residue/residue.service';

import { CreateShiftDTO } from './dto/create-shift.dto';

import { IList, IShift, ISuccess } from '../../shared/interfaces/api.interface';
import {
  compareShifts,
  getNextShift,
  getProfessionCounts,
  isShowShift,
} from '../../shared/utils/utils';

@Injectable()
export class ShiftService {
  constructor(
    private readonly authService: AuthService,
    private readonly shiftRepository: ShiftRepository,
    private readonly userRepository: UserRepository,
    private readonly userShiftService: UserShiftService,
    private readonly productionService: ProductionService,
    private readonly shipmentService: ShipmentService,
    private readonly packService: PackService,
    private readonly fixService: FixService,
    private readonly residueService: ResidueService,
  ) {}

  async createShift(
    dto: CreateShiftDTO,
    req: Request,
    res: Response,
  ): Promise<ISuccess> {
    try {
      // Проверяем токен
      await this.authService.validateAccessToken(req, res);

      // Локальное время от пользователя
      let localDate = new Date(dto.date);

      let startShift: Date;
      let endShift: Date;
      let finalDate: Date;

      if (dto.shiftNumber === 1) {
        // Шаг 1. Начало смены: 19:30 того же дня
        startShift = new Date(localDate);
        startShift.setHours(14, 30, 0, 0);

        // Шаг 2. Конец смены: +1 день от startShift, 07:30
        endShift = new Date(startShift);
        endShift.setDate(endShift.getDate() + 1);
        endShift.setHours(2, 30, 0, 0);

        // Для смены 1 localDate + 1 день
        finalDate = new Date(localDate);
        finalDate.setDate(localDate.getDate() + 1);
      } else {
        // Смена 2: 07:30 → 19:30 в тот же день
        startShift = new Date(localDate);
        startShift.setHours(2, 30, 0, 0);

        endShift = new Date(localDate);
        endShift.setHours(14, 30, 0, 0);

        finalDate = localDate;
      }

      // Конвертация в UTC
      // startShift = new Date(startShift.toISOString());
      // endShift = new Date(endShift.toISOString());

      // Создаем объект для проверки
      const newShift = new Shift();
      newShift.date = finalDate;
      newShift.shiftNumber = dto.shiftNumber;
      newShift.teamNumber = dto.teamNumber;
      newShift.startShift = startShift;
      newShift.endShift = endShift;

      const nextShift = getNextShift(dto.teamNumber);
      const equal = compareShifts(nextShift, newShift);

      if (!equal) {
        throw new ConflictException('Нарушение графика');
      }

      // Проверяем уникальность смены
      const existingShift = await this.shiftRepository.findOne(newShift);

      if (existingShift) {
        throw new ConflictException('Смена уже создана');
      }

      // Сохраняем смену
      const shift = await this.shiftRepository.create(newShift);

      // Получаем пользователей бригады
      const usersOfLPC11 = await this.userRepository.findUsersByTeamLPC11(
        newShift.teamNumber,
      );

      // Создаем связь с userShift
      await this.userShiftService.createUsersShifts(shift, usersOfLPC11);

      // Создаем связь с production
      await this.productionService.createProductions(shift);

      // Создаем связь с shipment
      await this.shipmentService.createShipments(shift);

      // Создаем связь с pack
      await this.packService.createPacks(shift);

      // Создаем связь с fix
      await this.fixService.createFixs(shift);

      // Создаем связь с residue
      await this.residueService.createResidues(shift);

      return {
        message: 'Смена успешно создана',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Ошибка при создании смены');
    }
  }

  async getActiveShift(req: Request, res: Response): Promise<IShift> {
    try {
      await this.authService.validateAccessToken(req, res);

      const activeShift = await this.shiftRepository.findActiveShift();

      if (!activeShift) {
        throw new NotFoundException('Идет планирование...');
      }

      return activeShift;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Произошла ошибка при получении смены',
      );
    }
  }

  async getFinishedShift(req: Request, res: Response): Promise<IShift | null> {
    try {
      await this.authService.validateAccessToken(req, res);

      const finishedShift = await this.shiftRepository.findFinishedShift();

      if (!finishedShift) {
        throw new NotFoundException('Нет данных');
      }

      return finishedShift;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Произошла ошибка при получении смены',
      );
    }
  }

  async getLastTeamShift(req: Request, res: Response): Promise<IShift> {
    try {
      const { currentTeamNumber } = await this.authService.validateAccessToken(
        req,
        res,
      );

      const lastShift =
        await this.shiftRepository.findLastTeamShift(currentTeamNumber);

      if (!lastShift) {
        throw new NotFoundException('Нет данных');
      }

      if (!isShowShift(lastShift)) {
        return null;
      }

      return lastShift;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Произошла ошибка при получении списка пользователей',
      );
    }
  }

  async getLastShiftsTeams(
    req: Request,
    res: Response,
  ): Promise<IList<IShift>> {
    await this.authService.validateAccessToken(req, res);

    const teamNumbers: number[] = [1, 2, 3, 4];
    const lastShifts: Shift[] = [];

    for (const teamNumber of teamNumbers) {
      const lastShift =
        await this.shiftRepository.findLastTeamShift(teamNumber);

      if (lastShift) {
        lastShifts.push(lastShift);
      }
    }

    return {
      total: lastShifts.length,
      items: lastShifts,
    };
  }
}
