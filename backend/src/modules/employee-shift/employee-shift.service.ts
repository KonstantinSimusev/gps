import { Injectable, NotFoundException } from '@nestjs/common';

import { EAttendanceCode } from '../../shared/enums/enums';
import { IEmployeeShiftList } from '../../shared/interfaces/api.interface';
import { EmployeeShiftRepository } from './employee-shift.repository';

@Injectable()
export class EmployeeShiftService {
  constructor(
    private readonly employeeShiftRepository: EmployeeShiftRepository,
  ) {}

  async getEmployeeShiftsByShiftId(
    shiftId: string,
  ): Promise<IEmployeeShiftList> {
    const employeeShifts =
      await this.employeeShiftRepository.findAllByShiftId(shiftId);

    if (employeeShifts.length === 0) {
      throw new NotFoundException('Смены сотрудников не найдены');
    }

    const isAssignmentComplete = employeeShifts.every((shift) => {
      // Если есть рабочее место — ок
      if (shift.workPlace !== null) {
        return true;
      }

      // Иначе проверяем, что attendanceType вообще загружен и код допустимый
      if (!shift.attendanceType) {
        return false;
      }

      return shift.attendanceType.attendanceCode === EAttendanceCode.V;
    });

    return {
      total: employeeShifts.length,
      items: employeeShifts,
      isAssignmentComplete,
    };
  }
}
