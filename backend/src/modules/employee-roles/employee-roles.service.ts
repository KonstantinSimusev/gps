import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { EmployeeRolesRepository } from './employee-roles.repository';
import { plainToInstance } from 'class-transformer';
import { EmployeeRole } from './entities/employee-role.entity';

@Injectable()
export class EmployeeRolesService {
  constructor(
    private readonly employeeRolesRepository: EmployeeRolesRepository,
  ) {}

  // async updateRoleStatus(roleId: string): Promise<ISuccess> {
  //   if (!roleId) {
  //     throw new BadRequestException('ID роли сотрудника не может быть пустым');
  //   }

  //   try {
  //     // Обновляем поле
  //     await this.employeeRolesRepository.activateRoleById(roleId);

  //     return {
  //       message: 'Статус роли успешно обновлён',
  //     };
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       'Произошла ошибка при обновлении роли сотрудника',
  //     );
  //   }
  // }

  // async deleteUser(id: string): Promise<ISuccess> {
  //   try {
  //     const user = await this.userRepository.findById(id);

  //     if (!user) {
  //       throw new NotFoundException('Пользователь не найден');
  //     }

  //     await this.userRepository.delete(id);

  //     return {
  //       message: 'Пользователь успешно удален',
  //     };
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       'Произошла ошибка при удалении пользователя',
  //     );
  //   }
  // }

}
