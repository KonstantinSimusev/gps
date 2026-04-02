import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { Employee } from './entities/employee.entity';

import { CreateEmployeeDTO } from './dto/create-employee.dto';
import { CreateEmployeesDTO } from './dto/create-employees.dto';
import { SearchEmployeeDTO } from './dto/search-employee.dto';

import { EmployeesRepository } from './employees.repository';
import { PositionsRepository } from '../positions/positions.repository';
import { TeamsRepository } from '../teams/teams.repository';
import { RolesRepository } from '../roles/roles.repository';
import { EmployeeRolesRepository } from '../employee-roles/employee-roles.repository';
import { AccountsService } from '../account/accounts.service';
import { WorkshopsRepository } from '../workshops/workshops.repository';

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
    private readonly rolesRepository: RolesRepository,
    private readonly accountsService: AccountsService,
    private readonly employeeRolesRepository: EmployeeRolesRepository,
    private readonly workshopsRepository: WorkshopsRepository,
  ) {}

  async create(
    dto: CreateEmployeeDTO,
    profileWorkshop?: string,
  ): Promise<IAccountInfo> {
    // Проверяем уникальность ФИО
    const isFullNameTaken = await this.employeesRepository.existsByFullName(
      dto.lastName,
      dto.firstName,
      dto.patronymic,
    );

    if (isFullNameTaken) {
      throw new ConflictException('ФИО занято');
    }

    // Проверяем уникальность личного номера
    const isPersonalNumberTaken =
      await this.employeesRepository.existsByPersonalNumber(dto.personalNumber);

    if (isPersonalNumberTaken) {
      throw new ConflictException('Личный номер занят');
    }

    // Проверяем наличие номера бригады
    const team = await this.teamsRepository.findTeamByTeamNumber(
      dto.teamNumber,
    );

    if (!team) {
      throw new NotFoundException('Номер бригады не найден');
    }

    // Проверяем существование штатной позиции
    const position = await this.positionsRepository.findPositionByCode(
      dto.positionCode,
    );

    if (!position) {
      throw new NotFoundException('Штатная позиция не найдена');
    }

    // Получаем роль для штатной позиции
    const role = await this.rolesRepository.findRoleByPositionCode(
      position.positionCode,
    );

    if (!role) {
      throw new NotFoundException('Роль не найдена');
    }

    // Получаем цех из БД по штатной позиции
    const dbWorkshop =
      await this.workshopsRepository.findWorkshopByPositionCode(
        dto.positionCode,
      );
    
    // Сравниваем цеха из БД и профиля
    if (dbWorkshop.code !== profileWorkshop) {
      throw new ConflictException('Позиция из другого цеха');
    }

    // Проверяем актуальность даты рождения
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dto.birthDay > today) {
      throw new BadRequestException('Дата рождения в будущем');
    }

    // Создаем аккаунт
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
    const savedEmployee = await this.employeesRepository.save(employee);

    // Создаём связь сотрудника с ролью
    await this.employeeRolesRepository.create(savedEmployee.id, role.id);

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

  async getEmployeeInfo(personalNumber: string): Promise<IEmployeeInfo> {
    const employeeInfo =
      await this.employeesRepository.findEmployeeByPersonalNumber(
        personalNumber,
      );

    if (!employeeInfo) {
      throw new NotFoundException('Работник не найден');
    }

    return employeeInfo;
  }
}
