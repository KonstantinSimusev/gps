import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ISuccess } from '../../shared/interfaces/api.interface';
import { EmployeeShiftRepository } from './employee-shift.repository';
import { EmployeeShift } from './entities/employee-shift.entity';

@Injectable()
export class EmployeeShiftService {
  constructor(
    private readonly employeeShiftRepository: EmployeeShiftRepository,
  ) {}

  async getEmployeeShift(id: string): Promise<EmployeeShift> {
    const employeeShift = await this.employeeShiftRepository.findById(id);

    if (!employeeShift) {
      throw new NotFoundException(`Смена сотрудника с ID ${id} не найдена`);
    }

    return employeeShift;
  }

  async deleteEmployeeShift(id: string): Promise<ISuccess> {
    const result = await this.employeeShiftRepository.deleteById(id);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Смена сотрудника с ID ${id} не найдена (уже удалена)`,
      );
    }

    return { message: 'Смена сотрудника успешно удалена' };
  }
}
