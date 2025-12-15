import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { Shift } from '../shift/entities/shift.entity';
import { Fix } from './entities/fix.entity';

import { AuthService } from '../auth/auth.service';
import { FixRepository } from './fix.repository';

import { UpdateFixDTO } from './dto/update-fix.dto';

import { IFix, IList, ISuccess } from '../../shared/interfaces/api.interface';
import { fixs } from '../../shared/utils/utils';

@Injectable()
export class FixService {
  constructor(
    private readonly authService: AuthService,
    private readonly fixRepository: FixRepository,
  ) {}

  async createFixs(shift: Shift): Promise<ISuccess> {
    try {
      await Promise.all(
        fixs.map((fix) => {
          const createdFix = new Fix();

          createdFix.location = fix.location;
          createdFix.railway = fix.railway;
          createdFix.count = fix.count;
          createdFix.sortOrder = fix.sortOrder;
          createdFix.shift = shift;

          return this.fixRepository.create(createdFix);
        }),
      );

      return {
        message: 'Раскрепления успешно созданы',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Ошибка при создании раскреплений',
      );
    }
  }

  async getFixs(id: string, req: Request, res: Response): Promise<IList<IFix>> {
    try {
      await this.authService.validateAccessToken(req, res);

      const fixs = await this.fixRepository.findFixsByShiftId(id);

      return {
        total: fixs.length,
        items: fixs,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Ошибка при получении раскрепления',
      );
    }
  }

  async updateFix(
    dto: UpdateFixDTO,
    req: Request,
    res: Response,
  ): Promise<ISuccess> {
    try {
      await this.authService.validateAccessToken(req, res);

      const fix = await this.fixRepository.findById(dto.id);

      if (!fix) {
        throw new NotFoundException('Раскрепление не найдено');
      }

      const updateFix = await this.fixRepository.update(fix, dto);

      if (!updateFix) {
        throw new NotFoundException('Раскрепление не обновлено');
      }

      return {
        message: 'Раскрепление успешно обновлено',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Произошла ошибка при обновлении раскрепления',
      );
    }
  }
}
