import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Workshop } from './entities/workshop.entity';

@Injectable()
export class WorkshopsRepository {
  constructor(
    @InjectRepository(Workshop)
    private readonly workshopsRepository: Repository<Workshop>,
  ) {}

  async findWorkshopByPositionCode(
    positionCode: string,
  ): Promise<{ code: string } | null> {
    return await this.workshopsRepository
      .createQueryBuilder('workshop')
      .innerJoin('workshop.positions', 'position')
      .where('position.positionCode = :positionCode', { positionCode })
      .select('workshop.workshopCode', 'code') // выбираем только поле workshopCode
      .getRawOne(); // получаем «сырой» результат из БД
  }

  async findWorkshopByEmployeeId(
    employeeId: string,
  ): Promise<{ code: string } | null> {
    return await this.workshopsRepository
      .createQueryBuilder('workshop')
      .innerJoin('workshop.positions', 'position')
      .innerJoin('position.employees', 'employee')
      .where('employee.id = :employeeId', { employeeId })
      .select('workshop.workshopCode', 'code')
      .getRawOne();
  }
}
