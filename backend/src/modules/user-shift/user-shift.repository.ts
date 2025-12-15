import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserShift } from './entities/user-shift.entity';

@Injectable()
export class UserShiftRepository {
  constructor(
    @InjectRepository(UserShift)
    private readonly userShiftRepository: Repository<UserShift>,
  ) {}

  async create(userShift: UserShift): Promise<UserShift> {
    const newUserShift = this.userShiftRepository.create(userShift);
    return await this.userShiftRepository.save(newUserShift);
  }

  async findById(id: string): Promise<UserShift> {
    return await this.userShiftRepository.findOneBy({ id });
  }

  async update(
    userShift: UserShift,
    updateData: Partial<UserShift>,
  ): Promise<UserShift> {
    return await this.userShiftRepository.save({
      ...userShift,
      ...updateData,
    });
  }

  async delete(id: string): Promise<void> {
    await this.userShiftRepository.delete(id);
  }

  async findUsersShiftsByShiftId(id: string): Promise<UserShift[]> {
    return this.userShiftRepository.find({
      where: {
        shift: { id },
      },
      order: {
        user: {
          sortOrder: 'ASC',
          lastName: 'ASC',
          firstName: 'ASC',
          patronymic: 'ASC',
        },
      },
      relations: ['user', 'shift'],
      select: {
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
    });
  }

  async existsByUserAndShift(
    userId: string,
    shiftId: string,
  ): Promise<boolean> {
    const count = await this.userShiftRepository.count({
      where: {
        user: { id: userId },
        shift: { id: shiftId },
      },
    });

    return count > 0;
  }
}
