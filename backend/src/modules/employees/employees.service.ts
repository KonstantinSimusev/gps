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
  ISuccess,
} from '../../shared/interfaces/api.interface';
import { UpdateEmployeeDTO } from './dto/update-employee.dto';

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
    isManyOperation: boolean = false,
  ): Promise<IAccountInfo> {
    // Проверяем актуальность даты рождения
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dto.birthDay > today) {
      throw new BadRequestException('Дата рождения в будущем');
    }

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

    // Проверяем цех только если это не массовая операция
    if (!isManyOperation) {
      // Получаем цех из БД по штатной позиции
      const dbWorkshop =
        await this.workshopsRepository.findWorkshopByPositionCode(
          dto.positionCode,
        );

      // Сравниваем цеха из БД и профиля
      if (dbWorkshop.code !== profileWorkshop) {
        throw new ConflictException('Позиция из другого цеха');
      }
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
        dtos.employees.map((dto) => this.create(dto, undefined, true)),
      );

      return {
        total: employees.length,
        items: employees,
      };
    } catch (error) {
      throw new InternalServerErrorException('Не удалось создать работника');
    }
  }

  async updateEmployee(
    id: string,
    dto: UpdateEmployeeDTO,
    profileWorkshop: string,
  ): Promise<IEmployeeInfo> {
    // Находим работника
    const employee = await this.employeesRepository.findOneById(id);

    if (!employee) {
      throw new NotFoundException('Работник не найден');
    }

    // Проверяем актуальность даты рождения
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const birthDay = new Date(dto.birthDay);
    birthDay.setHours(0, 0, 0, 0);

    if (birthDay > today) {
      throw new BadRequestException('Дата рождения в будущем');
    }

    // Проверяем уникальность ФИО
    const isFullNameTaken =
      await this.employeesRepository.existsByFullNameExcluding(
        employee.id,
        dto.lastName,
        dto.firstName,
        dto.patronymic,
      );

    if (isFullNameTaken) {
      throw new ConflictException('ФИО занято');
    }

    // Проверяем уникальность личного номера
    const isPersonalNumberTaken =
      await this.employeesRepository.existsByPersonalNumberExcluding(
        employee.id,
        dto.personalNumber,
      );

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

    // Получаем цех из БД по штатной позиции
    const dbWorkshop =
      await this.workshopsRepository.findWorkshopByPositionCode(
        dto.positionCode,
      );

    // Сравниваем цеха из БД и профиля
    if (dbWorkshop.code !== profileWorkshop) {
      throw new ConflictException('Позиция из другого цеха');
    }

    // Обновляем роль
    if (!dto.role) {
      await this.clearEmployeeRole(employee.id);
    } else {
      await this.setEmployeeRole(employee.id, dto.role);
    }

    // Обновление полей сущности
    employee.lastName = dto.lastName;
    employee.firstName = dto.firstName;
    employee.patronymic = dto.patronymic;
    employee.personalNumber = dto.personalNumber;
    employee.team = team;
    employee.position = position;
    employee.birthDay = dto.birthDay;
    employee.startDate = dto.startDate;

    // Логика для endDate и isActive
    if (dto.endDate !== null) {
      employee.endDate = dto.endDate;
      employee.isActive = false; // деактивация при установке endDate
    } else {
      // если endDate убрали, активируем сотрудника
      employee.endDate = null;
      employee.isActive = true;
    }

    await this.employeesRepository.save(employee);

    return this.employeesRepository.findEmployeeByPersonalNumber(
      employee.personalNumber,
    );
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

  async deleteEmployee(id: string, profileWorkshop: string): Promise<ISuccess> {
    // Получаем цех из БД по ID работника
    const dbWorkshop =
      await this.workshopsRepository.findWorkshopByEmployeeId(id);

    // Сравниваем цеха из БД и профиля
    if (dbWorkshop.code !== profileWorkshop) {
      throw new ConflictException('Позиция из другого цеха');
    }
    
    const result = await this.employeesRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Работник не найден');
    }

    return {
      message: 'Работник успешно удален',
    };
  }

  private async clearEmployeeRole(employeeId: string): Promise<void> {
    const employeeRole =
      await this.employeeRolesRepository.findEmployeeRoleByEmployee(employeeId);

    if (employeeRole) {
      await this.employeeRolesRepository.deleteByEmployeeId(employeeId);
    }
  }

  private async setEmployeeRole(
    employeeId: string,
    roleName: string,
  ): Promise<void> {
    const defaultRole = await this.rolesRepository.findRoleByName(roleName);
    if (!defaultRole) {
      throw new NotFoundException('Роль не найдена');
    }

    const employeeRole =
      await this.employeeRolesRepository.findEmployeeRoleByEmployee(employeeId);

    if (!employeeRole) {
      await this.employeeRolesRepository.create(employeeId, defaultRole.id);
    } else {
      if (employeeRole.name !== roleName) {
        await this.employeeRolesRepository.update(employeeId, defaultRole.id);
      }
    }
  }
}
