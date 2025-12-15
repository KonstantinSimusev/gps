import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { Shift } from '../shift/entities/shift.entity';
import { Pack } from './entities/pack.entity';

import { AuthService } from '../auth/auth.service';
import { ShiftRepository } from '../shift/shift.repository';
import { PackRepository } from './pack.repository';
import { ResidueRepository } from '../residue/residue.repository';

import { UpdatePackDTO } from './dto/update-pack.dto';

import { IList, IPack, ISuccess } from '../../shared/interfaces/api.interface';
import { packs } from '../../shared/utils/utils';

@Injectable()
export class PackService {
  constructor(
    private readonly authService: AuthService,
    private readonly packRepository: PackRepository,
    private readonly shiftRepository: ShiftRepository,
    private readonly residueRepository: ResidueRepository,
  ) {}

  async createPacks(shift: Shift): Promise<ISuccess> {
    try {
      await Promise.all(
        packs.map((pack) => {
          const createdPack = new Pack();

          createdPack.location = pack.location;
          createdPack.area = pack.area;
          createdPack.count = pack.count;
          createdPack.sortOrder = pack.sortOrder;
          createdPack.shift = shift;

          return this.packRepository.create(createdPack);
        }),
      );

      return {
        message: 'Упаковки успешно созданы',
      };
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при создании упаковок');
    }
  }

  async getPacks(
    id: string,
    req: Request,
    res: Response,
  ): Promise<IList<IPack>> {
    try {
      await this.authService.validateAccessToken(req, res);

      const packs = await this.packRepository.findPacksByShiftId(id);

      return {
        total: packs.length,
        items: packs,
      };
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при получении упаковок');
    }
  }

  async updatePack(
    dto: UpdatePackDTO,
    req: Request,
    res: Response,
  ): Promise<ISuccess> {
    try {
      // 1. Проверка авторизации
      await this.authService.validateAccessToken(req, res);

      // 2. Получение упаковки по ID
      const pack = await this.packRepository.findById(dto.id);

      if (!pack) {
        throw new NotFoundException('Упаковка не найдена');
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
          (item) => item.location === pack.location,
        );
        if (previousResidue) {
          previousResidueCount = previousResidue.count;
        }
      }

      // 5. Получение текущего производства (если нет — считаем 0)
      const currentProduction = currentShift.productions.filter(
        (item) => item.location === pack.location,
      );

      const currentProductionCount = currentProduction.reduce(
        (total, item) => total + item.count,
        0,
      );

      // 6. Получение текущей упаковки без DTO (если нет — считаем 0)
      const currentPack = currentShift.packs.filter(
        (item) => item.location === pack.location && item.area !== pack.area,
      );

      const currentPackCount = currentPack.reduce(
        (total, item) => total + item.count,
        0,
      );

      // 7. Расчёт текущего остатка
      const newResidueCount =
        previousResidueCount +
        currentProductionCount -
        (currentPackCount + dto.count);

      // 8. Проверка результата расчёта
      if (newResidueCount < 0) {
        throw new InternalServerErrorException('Введите число меньше');
      }

      // 9. Обновление текущего остатка (если остаток существует — обновляем, иначе пропускаем)
      const currentResidue = currentShift.residues.find(
        (item) => item.location === pack.location,
      );

      if (currentResidue) {
        await this.residueRepository.update(currentResidue, {
          count: newResidueCount,
        });
      }

      // 10. Обновление упаковки
      const updatedPack = await this.packRepository.update(pack, dto);

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
