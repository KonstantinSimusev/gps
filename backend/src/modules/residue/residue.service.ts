import {
  Body,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { Shift } from '../shift/entities/shift.entity';
import { Residue } from './entities/residue.entity';

import { AuthService } from '../auth/auth.service';
import { ResidueRepository } from './residue.repository';

import { UpdateResidueDTO } from './dto/update-residue.dto';

import {
  IList,
  IResidue,
  ISuccess,
} from '../../shared/interfaces/api.interface';

import { residues } from '../../shared/utils/utils';

@Injectable()
export class ResidueService {
  constructor(
    private readonly authService: AuthService,
    private readonly residueRepository: ResidueRepository,
  ) {}

  async createResidues(shift: Shift): Promise<ISuccess> {
    try {
      await Promise.all(
        residues.map((residue) => {
          const createdResidue = new Residue();

          createdResidue.location = residue.location;
          createdResidue.area = residue.area;
          createdResidue.count = residue.count;
          createdResidue.sortOrder = residue.sortOrder;
          createdResidue.shift = shift;

          return this.residueRepository.create(createdResidue);
        }),
      );

      return {
        message: 'Остатки успешно созданы',
      };
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при создании остатков');
    }
  }

  async getResidues(
    id: string,
    req: Request,
    res: Response,
  ): Promise<IList<IResidue>> {
    try {
      await this.authService.validateAccessToken(req, res);

      const residues = await this.residueRepository.findResiduesByShiftId(id);

      return {
        total: residues.length,
        items: residues,
      };
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при получении остатков');
    }
  }

  async updateResidue(
    dto: UpdateResidueDTO,
    req: Request,
    res: Response,
  ): Promise<ISuccess> {
    try {
      await this.authService.validateAccessToken(req, res);

      const residue = await this.residueRepository.findById(dto.id);

      if (!residue) {
        throw new NotFoundException('Остаток не найден');
      }

      const updateResidue = await this.residueRepository.update(residue, dto);

      if (!updateResidue) {
        throw new NotFoundException('Остаток не обновлен');
      }

      return {
        message: 'Остаток успешно обновлен',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Произошла ошибка при обновлении остатка',
      );
    }
  }
}
