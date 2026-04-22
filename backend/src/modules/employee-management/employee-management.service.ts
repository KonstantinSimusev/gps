import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Employee } from '../employees/entities/employee.entity';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateEmployeesDto } from './dto/create-employees.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

import {
  IAccountInfo,
  IEmployeeInfo,
  IList,
  ISuccess,
} from '../../shared/interfaces/api.interface';

import { AccountService } from '../accounts/account.service';
import { EmployeeRolesRepository } from '../employee-roles/employee-roles.repository';
import { EmployeesRepository } from '../employees/employees.repository';
import { PositionsRepository } from '../positions/positions.repository';
import { RolesRepository } from '../roles/roles.repository';
import { TeamsRepository } from '../teams/teams.repository';
import { WorkshopsRepository } from '../workshops/workshops.repository';

@Injectable()
export class EmployeeManagementService {
  constructor(
    private readonly accountService: AccountService,
    private readonly employeeRolesRepository: EmployeeRolesRepository,
    private readonly employeesRepository: EmployeesRepository,
    private readonly positionsRepository: PositionsRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly teamsRepository: TeamsRepository,
    private readonly workshopsRepository: WorkshopsRepository,
  ) {}

  async createEmployee(
    dto: CreateEmployeeDto,
    profileWorkshop?: string,
    isManyOperation: boolean = false,
  ): Promise<IAccountInfo> {
    // Валидация даты рождения
    this.validateBirthDate(dto.birthDay);

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

    // Проверка цеха (только если не массовая операция)
    if (!isManyOperation) {
      await this.validateWorkshop(dto.positionCode, profileWorkshop);
    }

    // Получаем роль для штатной позиции
    const role = await this.rolesRepository.findRoleByPositionCode(
      position.positionCode,
    );

    if (!role) {
      throw new NotFoundException('Роль не найдена');
    }

    // Создаем аккаунт
    const { account, initialPassword } =
      await this.accountService.createAсcount(
        dto.lastName,
        dto.firstName,
        dto.patronymic,
      );

    // Формируем данные для создания сотрудника
    const employeeData: Partial<Employee> = {
      ...dto,
      position,
      team,
      account,
    };

    // Создаём сотрудника через репозиторий
    const savedEmployee = await this.employeesRepository.create(employeeData);

    // Создаём связь сотрудника с ролью
    await this.employeeRolesRepository.create(savedEmployee.id, role.id);

    return {
      lastName: dto.lastName,
      firstName: dto.firstName,
      patronymic: dto.patronymic,
      login: account.login,
      password: initialPassword,
    };
  }

  async createMany(dtos: CreateEmployeesDto): Promise<IList<IAccountInfo>> {
    try {
      const employees = await Promise.all(
        dtos.employees.map((dto) => this.createEmployee(dto, undefined, true)),
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
    dto: UpdateEmployeeDto,
    profileWorkshop: string,
  ): Promise<IEmployeeInfo> {
    // Находим работника
    const employee = await this.employeesRepository.findOne(id);

    if (!employee) {
      throw new NotFoundException('Работник не найден');
    }

    // Все валидации выполняются ДО любых изменений
    await this.validateUpdateData(employee.id, dto, profileWorkshop);

    // Получаем связанные сущности (уже проверено, что они существуют)
    const team = await this.teamsRepository.findTeamByTeamNumber(
      dto.teamNumber,
    );

    const position = await this.positionsRepository.findPositionByCode(
      dto.positionCode,
    );

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

    // Логика endDate и isActive с обработкой ролей
    await this.handleEmployeeStatusAndRole(employee, dto);

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

    const result = await this.employeesRepository.remove(id);

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
      await this.employeeRolesRepository.removeEmployeeRole(employeeId);
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
      if (employeeRole.role.name !== roleName) {
        await this.employeeRolesRepository.update(employeeId, defaultRole.id);
      }
    }
  }

  private async validateWorkshop(
    positionCode: string,
    profileWorkshop: string,
  ): Promise<void> {
    const position =
      await this.positionsRepository.findPositionByCode(positionCode);

    if (!position) {
      throw new NotFoundException('Позиция не найдена');
    }

    const dbWorkshop =
      await this.workshopsRepository.findWorkshopByPositionCode(positionCode);

    if (dbWorkshop.code !== profileWorkshop) {
      throw new ConflictException('Позиция из другого цеха');
    }
  }

  private validateBirthDate(birthDay: Date): void {
    if (birthDay > new Date()) {
      throw new BadRequestException('Дата рождения в будущем');
    }
  }

  private async validateEmployeeUniqueness(
    employeeId: string,
    dto: UpdateEmployeeDto,
  ): Promise<void> {
    const isFullNameTaken =
      await this.employeesRepository.existsByFullNameExcluding(
        employeeId,
        dto.lastName,
        dto.firstName,
        dto.patronymic,
      );

    if (isFullNameTaken) {
      throw new ConflictException('ФИО занято');
    }

    const isPersonalNumberTaken =
      await this.employeesRepository.existsByPersonalNumberExcluding(
        employeeId,
        dto.personalNumber,
      );

    if (isPersonalNumberTaken) {
      throw new ConflictException('Личный номер занят');
    }
  }

  private async validateUpdateData(
    employeeId: string,
    dto: UpdateEmployeeDto,
    profileWorkshop: string,
  ): Promise<void> {
    // Проверка цеха
    await this.validateWorkshop(dto.positionCode, profileWorkshop);

    // Валидация даты рождения
    this.validateBirthDate(dto.birthDay);

    // Проверки уникальности
    await this.validateEmployeeUniqueness(employeeId, dto);

    // Явная проверка существования бригады
    const team = await this.teamsRepository.findTeamByTeamNumber(
      dto.teamNumber,
    );

    if (!team) {
      throw new NotFoundException('№ бригады не найден');
    }

    // Явная проверка существования позиции
    const position = await this.positionsRepository.findPositionByCode(
      dto.positionCode,
    );

    if (!position) {
      throw new NotFoundException('Позиция не найдена');
    }
  }

  private async handleEmployeeStatusAndRole(
    employee: Employee,
    dto: UpdateEmployeeDto,
  ): Promise<void> {
    if (dto.endDate !== null) {
      employee.endDate = dto.endDate;
      employee.isActive = false; // Деактивация при установке endDate

      await this.clearEmployeeRole(employee.id);
    } else {
      employee.endDate = null;
      employee.isActive = true; // Активация при отсутствии endDate

      if (dto.role) {
        await this.setEmployeeRole(employee.id, dto.role); // Если роль указана в DTO — устанавливаем её
      } else {
        // Иначе — берём роль по штатной позиции
        const defaultRole = await this.rolesRepository.findRoleByPositionCode(
          dto.positionCode,
        );

        if (!defaultRole) {
          throw new NotFoundException('Роль не найдена');
        }

        await this.employeeRolesRepository.create(employee.id, defaultRole.id);
      }
    }
  }
}
