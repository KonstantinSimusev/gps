import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThan, LessThan } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { Shift } from './entities/shift.entity';

@Injectable()
export class ShiftRepository {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) {}

  async create(shift: Shift): Promise<Shift> {
    const newShift = this.shiftRepository.create(shift);
    return this.shiftRepository.save(newShift);
  }

  async findAll(): Promise<Shift[]> {
    return this.shiftRepository.find({});
  }

  async findById(id: string): Promise<Shift> {
    return this.shiftRepository.findOneBy({ id });
  }

  async delete(id: string): Promise<void> {
    this.shiftRepository.delete(id);
  }

  async findOne(shift: Shift): Promise<Shift> {
    return this.shiftRepository.findOne({
      where: {
        date: shift.date,
        teamNumber: shift.teamNumber,
        shiftNumber: shift.shiftNumber,
      },
    });
  }

  async findActiveShift(): Promise<Shift> {
    const nowUTC = new Date(new Date().toISOString());

    return this.shiftRepository.findOne({
      where: {
        startShift: LessThanOrEqual(nowUTC), // startShift <= now
        endShift: MoreThan(nowUTC), // endShift > now
      },
      order: {
        date: 'DESC', // 1. самые свежие даты
        shiftNumber: 'DESC', // 2. наибольший номер смены
        productions: { sortOrder: 'ASC' }, // 3. по порядку productions
        shipments: { sortOrder: 'ASC' }, // 4. по порядку shipments
        packs: { sortOrder: 'ASC' }, // 5. по порядку packs
        fixs: { sortOrder: 'ASC' }, // 6. по порядку fixs
        residues: { sortOrder: 'ASC' }, // 7. по порядку residues
      },
      relations: [
        'usersShifts',
        'usersShifts.user',
        'productions',
        'shipments',
        'packs',
        'fixs',
        'residues',
      ],

      select: {
        // Поля Shift
        id: true,
        date: true,
        shiftNumber: true,
        teamNumber: true,
        startShift: true,
        endShift: true,

        // Поля UserShift
        usersShifts: {
          id: true,
          workStatus: true,
          workPlace: true,
          shiftProfession: true,
          workHours: true,

          // Поля User (вложенные)
          user: {
            id: true,
            positionCode: true,
            lastName: true,
            firstName: true,
            patronymic: true,
            profession: true,
            grade: true,
            personalNumber: true,
            teamNumber: true,
            currentTeamNumber: true,
            workSchedule: true,
            workshopCode: true,
            role: true,
            sortOrder: true,
            // hashedPassword не указываем → не загружаем
          },
        },
      },
    });
  }

  async findFinishedShift(): Promise<Shift> {
    const nowUTC = new Date(new Date().toISOString());

    return this.shiftRepository.findOne({
      where: {
        endShift: LessThan(nowUTC), // endShift < nowUTC (смена уже закончилась)
      },
      order: {
        date: 'DESC', // 1. самые свежие даты
        shiftNumber: 'DESC', // 2. наибольший номер смены
        productions: { sortOrder: 'ASC' }, // 3. по порядку productions
        shipments: { sortOrder: 'ASC' }, // 4. по порядку shipments
        packs: { sortOrder: 'ASC' }, // 5. по порядку packs
        fixs: { sortOrder: 'ASC' }, // 6. по порядку fixs
        residues: { sortOrder: 'ASC' }, // 7. по порядку residues
      },
      relations: [
        'usersShifts',
        'usersShifts.user',
        'productions',
        'shipments',
        'packs',
        'fixs',
        'residues',
      ],

      select: {
        // Поля Shift
        id: true,
        date: true,
        shiftNumber: true,
        teamNumber: true,
        startShift: true,
        endShift: true,

        // Поля UserShift
        usersShifts: {
          id: true,
          workStatus: true,
          workPlace: true,
          shiftProfession: true,
          workHours: true,

          // Поля User (вложенные)
          user: {
            id: true,
            positionCode: true,
            lastName: true,
            firstName: true,
            patronymic: true,
            profession: true,
            grade: true,
            personalNumber: true,
            teamNumber: true,
            currentTeamNumber: true,
            workSchedule: true,
            workshopCode: true,
            role: true,
            sortOrder: true,
            // hashedPassword не указываем → не загружаем
          },
        },
      },
    });
  }

  async findLastTeamShift(teamNumber: number): Promise<Shift> {
    return this.shiftRepository.findOne({
      where: {
        teamNumber,
      },
      order: {
        date: 'DESC',
        productions: { sortOrder: 'ASC' },
        shipments: { sortOrder: 'ASC' },
        packs: { sortOrder: 'ASC' },
        fixs: { sortOrder: 'ASC' },
        residues: { sortOrder: 'ASC' },
        // Добавляем сортировку для usersShifts.user
        usersShifts: {
          user: {
            sortOrder: 'ASC',
            lastName: 'ASC',
            firstName: 'ASC',
            patronymic: 'ASC',
          },
        },
      },
      relations: [
        'usersShifts',
        'usersShifts.user',
        'productions',
        'shipments',
        'packs',
        'fixs',
        'residues',
      ],
      select: {
        // Поля Shift
        id: true,
        date: true,
        shiftNumber: true,
        teamNumber: true,
        startShift: true,
        endShift: true,

        // Поля UserShift
        usersShifts: {
          id: true,
          workStatus: true,
          workPlace: true,
          shiftProfession: true,
          workHours: true,

          // Поля User (вложенные)
          user: {
            id: true,
            positionCode: true,
            lastName: true,
            firstName: true,
            patronymic: true,
            profession: true,
            grade: true,
            personalNumber: true,
            teamNumber: true,
            currentTeamNumber: true,
            workSchedule: true,
            workshopCode: true,
            role: true,
            sortOrder: true,
            // hashedPassword не указываем → не загружаем
          },
        },
      },
    });
  }

  async findCurrentShiftById(id: string): Promise<Shift> {
    return this.shiftRepository.findOne({
      where: { id },
      relations: ['productions', 'packs', 'residues'],
    });
  }

  async findPreviousShift(currentShift: Shift): Promise<Shift[]> {
    return this.shiftRepository.find({
      where: [
        {
          date: LessThan(currentShift.date), // дата строго раньше
        },
        {
          date: currentShift.date,
          shiftNumber: LessThan(currentShift.shiftNumber), // та же дата, но номер меньше
        },
      ],
      order: {
        date: 'DESC',
        shiftNumber: 'DESC',
      },
      relations: ['residues'],
      take: 1,
    });
  }

  /*
  async update(shift: Shift, updateData: Partial<Shift>): Promise<Shift> {
    return this.shiftRepository.save({
      ...shift,
      ...updateData,
    });
  }
  */
}
