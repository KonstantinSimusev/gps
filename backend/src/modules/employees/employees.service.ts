import {
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
  IAccountInfo,
  IEmployeeInfo,
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

  async create(dto: CreateEmployeeDTO): Promise<IAccountInfo> {
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

  async createMany(dtos: CreateEmployeesDTO): Promise<IList<IAccountInfo>> {
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

  async getEmployeeInfo(number: string): Promise<IEmployeeInfo> {
    const employeeInfo =
      await this.employeesRepository.findEmployeeByPersonalNumber(number);

    if (!employeeInfo) {
      throw new NotFoundException(
        'Сотрудник с указанным личным номером не найден или неактивен',
      );
    }

    return employeeInfo;
  }
}
