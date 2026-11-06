import { Injectable, NotFoundException } from '@nestjs/common';

import { ISuccess } from '../../shared/interfaces/api.interface';

import { Shift } from './entities/shift.entity';
import { ShiftRepository } from './shift.repository';
import { ShiftIdDto } from './dto/shift-id.dto';

@Injectable()
export class ShiftService {
  constructor(private readonly shiftRepository: ShiftRepository) {}

  async getShiftById(id: string): Promise<Shift> {
    const shift = await this.shiftRepository.findOneById(id);

    if (!shift) {
      throw new NotFoundException(`Смена с ID ${id} не найдена`);
    }

    return shift;
  }

  async getShiftByDate(
    date: Date,
    workshopId: string,
    teamId: string,
    scheduleId: string,
  ): Promise<Shift | null> {
    const shift = await this.shiftRepository.findOneByDate(
      date,
      workshopId,
      teamId,
      scheduleId,
    );

    // if (!shift) {
    //   throw new NotFoundException('Смена не найдена');
    // }

    return shift;
  }

  async getAllShiftByDate(
    date: Date,
    workshopId: string,
    teamId: string,
    scheduleId: string,
  ): Promise<Shift[]> {
    const shifts = await this.shiftRepository.findAllByDate(
      date,
      workshopId,
      teamId,
      scheduleId,
    );

    return shifts;
  }

  // async setCheckedByShiftId(dto: ShiftIdDto): Promise<ISuccess> {
  //   const shift = await this.shiftRepository.findOneById(dto.id);

  //   if (!shift) {
  //     throw new NotFoundException(`Смена с ID ${dto.id} не найдена`);
  //   }

  //   shift.isChecked = true;
  //   await this.shiftRepository.save(shift);

  //   return { message: 'Поле обновлено' };
  // }

  /*
  async setCheckedByShiftId(dto: ShiftIdDto): Promise<ISuccess> {
    // Загружаем смену со всеми связями (включая currentPosition.profession)
    const shift = await this.shiftRepository.findOneById(dto.id);

    // Проверяем, что смена существует
    if (!shift) {
      throw new NotFoundException(`Смена с ID ${dto.id} не найдена`);
    }

    // Вычисляем: выходной или рабочий день
    // shiftSchedule === null → выходной (создаётся через createShiftForHoliday)
    const isDayOff = !shift.shiftSchedule;

    if (isDayOff) {
      // Получаем тип посещаемости "В" (выходной)
      const attendanceTypeV =
        await this.attendanceTypeService.getAttendanceType(EAttendanceCode.V);

      // Всем сотрудникам ставим тип "В" — рабочее место не нужно
      for (const es of shift.employeeShifts) {
        es.attendanceType = attendanceTypeV;
        // workplace остаётся null — для выходного это нормально
      }
    } else {
      // Рабочий день — назначаем рабочие места по профессии позиции
      for (const es of shift.employeeShifts) {
        // Если рабочее место уже назначено — пропускаем
        if (es.workplace) continue;

        // Получаем профессию из текущей позиции сотрудника
        const professionId = es.currentPosition?.profession?.id;

        if (!professionId) {
          throw new ConflictException(
            `У сотрудника в employee_shift ${es.id} не определена профессия в позиции`,
          );
        }

        // Ищем рабочее место по цеху смены и профессии позиции
        const workplace =
          await this.workplaceRepository.findByWorkshopAndProfession(
            shift.workshop.id,
            professionId,
          );

        if (!workplace) {
          throw new NotFoundException(
            `Рабочее место не найдено для цеха ${shift.workshop.id} и профессии ${professionId}`,
          );
        }

        es.workplace = workplace;
      }
    }

    // Сохраняем обновлённые записи сотрудников
    await this.employeeShiftRepository.save(shift.employeeShifts);

    // Отмечаем смену как проверенную
    shift.isChecked = true;
    await this.shiftRepository.save(shift);

    return { message: 'Поле обновлено' };
  }
  */
}
