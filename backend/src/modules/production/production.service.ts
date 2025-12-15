import {
  Body,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { Shift } from '../shift/entities/shift.entity';
import { Production } from './entities/production.entity';

import { AuthService } from '../auth/auth.service';
import { ProductionRepository } from './production.repository';
import { ResidueRepository } from '../residue/residue.repository';
import { ShiftRepository } from '../shift/shift.repository';

import { UpdateProductionDTO } from './dto/update-production.dto';
import { UpdatePackDTO } from '../pack/dto/update-pack.dto';

import {
  IList,
  IProduction,
  ISuccess,
} from '../../shared/interfaces/api.interface';

import { productions } from '../../shared/utils/utils';

@Injectable()
export class ProductionService {
  constructor(
    private readonly authService: AuthService,
    private readonly productionRepository: ProductionRepository,
    private readonly shiftRepository: ShiftRepository,
    private readonly residueRepository: ResidueRepository,
  ) {}

  async createProductions(shift: Shift): Promise<ISuccess> {
    try {
      await Promise.all(
        productions.map((production) => {
          const createdProduction = new Production();

          createdProduction.location = production.location;
          createdProduction.unit = production.unit;
          createdProduction.count = production.count;
          createdProduction.sortOrder = production.sortOrder;
          createdProduction.shift = shift;

          return this.productionRepository.create(createdProduction);
        }),
      );

      return {
        message: 'Производства успешно созданы',
      };
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при создании производств');
    }
  }

  async getProductions(
    id: string,
    req: Request,
    res: Response,
  ): Promise<IList<IProduction>> {
    try {
      await this.authService.validateAccessToken(req, res);

      const productions =
        await this.productionRepository.findProductionsByShiftId(id);

      return {
        total: productions.length,
        items: productions,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Ошибка при получении производств',
      );
    }
  }

  async updateProduction(
    dto: UpdateProductionDTO,
    req: Request,
    res: Response,
  ): Promise<ISuccess> {
    try {
      // 1. Проверка авторизации
      await this.authService.validateAccessToken(req, res);

      // 2. Получение производства по ID
      const production = await this.productionRepository.findById(dto.id);

      if (!production) {
        throw new NotFoundException('Производство не найдено');
      }

      // 3. Получение текущей смены по ID
      const currentShift = await this.shiftRepository.findCurrentShiftById(
        dto.shiftId,
      );

      if (!currentShift) {
        throw new NotFoundException('Смена не найдена');
      }

      // 4. Получение предыдущей смены (если нет — считаем остаток 0)
      const previousShift =
        await this.shiftRepository.findPreviousShift(currentShift);

      let previousResidueCount = 0;

      if (previousShift.length > 0) {
        const previousResidues = previousShift[0].residues;
        const previousResidue = previousResidues.find(
          (item) => item.location === production.location,
        );
        if (previousResidue) {
          previousResidueCount = previousResidue.count;
        }
      }

      // 5. Получение текущей упаковки (если нет — считаем 0)
      const currentPack = currentShift.packs.filter(
        (item) => item.location === production.location,
      );

      const currentPackCount = currentPack.reduce(
        (total, item) => total + item.count,
        0,
      );

      // 6. Получение текущего производства без DTO (если нет — считаем 0)
      const currentProduction = currentShift.productions.filter(
        (item) =>
          item.location === production.location &&
          item.unit !== production.unit,
      );

      const currentProductionCount = currentProduction.reduce(
        (total, item) => total + item.count,
        0,
      );

      // 7. Расчёт текущего остатка
      const newResidueCount =
        previousResidueCount +
        (currentProductionCount + dto.count) -
        currentPackCount;

      // 8. Проверка результата расчёта
      if (newResidueCount < 0) {
        throw new InternalServerErrorException('Введите число меньше');
      }

      // 9. Обновление текущего остатка (если остаток существует — обновляем, иначе пропускаем)
      const currentResidue = currentShift.residues.find(
        (item) => item.location === production.location,
      );

      if (currentResidue) {
        await this.residueRepository.update(currentResidue, {
          count: newResidueCount,
        });
      }

      // 10. Обновление производство
      const updatedPack = await this.productionRepository.update(
        production,
        dto,
      );

      if (!updatedPack) {
        throw new NotFoundException('Упаковка не обновлена');
      }

      return {
        message: 'Упаковка успешно обновлена',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Произошла ошибка при обновлении упаковки',
      );
    }
  }
}
