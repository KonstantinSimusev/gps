import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { Employee } from './entities/employee.entity';

import { CreateEmployeeDTO } from './dto/create-employee.dto';
import { CreateEmployeesDTO } from './dto/create-employees.dto';

import { EmployeesRepository } from './employees.repository';
import { PositionsRepository } from '../positions/positions.repository';
import { TeamsRepository } from '../teams/teams.repository';
import { AccountsService } from '../account/accounts.service';

import {
  IEmployee,
  IAccountAPI,
  IList,
} from '../../shared/interfaces/api.interface';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly employeesRepository: EmployeesRepository,
    private readonly positionsRepository: PositionsRepository,
    private readonly teamsRepository: TeamsRepository,
    private readonly accountsService: AccountsService,
  ) {}

  async create(dto: CreateEmployeeDTO): Promise<IAccountAPI> {
    const position = await this.positionsRepository.findPositionByCode(
      dto.positionCode,
    );

    if (!position) {
      throw new NotFoundException(
        `Штатная позиция ${dto.positionCode} не найдена`,
      );
    }

    const team = await this.teamsRepository.findTeamByTeamNumber(
      dto.teamNumber,
    );

    if (!team) {
      throw new NotFoundException(`Номер бригады ${dto.teamNumber} не найден`);
    }

    const { account, initialPassword } =
      await this.accountsService.createAсcount(
        dto.lastName,
        dto.firstName,
        dto.patronymic,
      );

    // Преобразовываем простой объект dto в сущность
    const employee = plainToInstance(Employee, dto);

    // Связываем с другими сущностями
    employee.position = position;
    employee.team = team;
    employee.account = account;

    // Сохраняем в базу данных
    await this.employeesRepository.save(employee);

    return {
      lastName: employee.lastName,
      firstName: employee.firstName,
      patronymic: employee.patronymic,
      login: account.login,
      password: initialPassword,
    };
  }

  async createMany(dtos: CreateEmployeesDTO): Promise<IList<IAccountAPI>> {
    try {
      const employees = await Promise.all(
        dtos.employees.map((dto) => this.create(dto)),
      );

      return {
        total: employees.length,
        items: employees,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Не удалось создать сотрудника: ${error.message}`,
      );
    }
  }

  // async update(id: string, dto: UpdateEmployeeDTO): Promise<IEmployee> {
  //   try {
  //     const employee = await this.employeesRepository.findById(id);

  //     if (!employee) {
  //       throw new NotFoundException('Работник не найден');
  //     }

  //     const updatedEmployee = await this.employeesRepository.update(employee, dto);

  //     if (!updatedEmployee) {
  //       throw new NotFoundException('Работник не обновлен');
  //     }

  //     return {
  //       message: 'Пользователь успешно обновлен',
  //     };
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       'Произошла ошибка при обновлении пользователя',
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

  // private transformUser(user: User): IUser {
  //   const { login, hashedPassword, refreshToken, ...apiUser } = user;
  //   return apiUser;
  // }
}
