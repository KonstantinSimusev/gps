import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateEmployeesDto } from './dto/create-employees.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

import {
  IAccountInfo,
  IEmployeeInfo,
  IList,
  ISuccess,
} from '../../shared/interfaces/api.interface';

import { AccountService } from '../account/account.service';
import { EmployeeRepository } from '../employee/employee.repository';
import { EmployeeRoleRepository } from '../employee-role/employee-role.repository';
import { PositionRepository } from '../position/position.repository';
import { RoleRepository } from '../role/role.repository';
import { TeamRepository } from '../team/team.repository';

@Injectable()
export class EmployeeManagementService {
  constructor(
    private readonly accountService: AccountService,
    private readonly employeeRepository: EmployeeRepository,
    private readonly employeeRoleRepository: EmployeeRoleRepository,
    private readonly positionRepository: PositionRepository,
    private readonly roleRepository: RoleRepository,
    private readonly teamRepository: TeamRepository,
  ) {}

  async createEmployee(
    dto: CreateEmployeeDto,
    profileWorkshop?: string,
    isManyOperation: boolean = false,
  ): Promise<IAccountInfo> {
    // Проверяем уникальность ФИО
    const isFullNameTaken = await this.employeeRepository.existsByFullName(
      dto.lastName,
      dto.firstName,
      dto.patronymic,
    );

    if (isFullNameTaken) {
      throw new ConflictException('ФИО занято');
    }

    // Проверяем уникальность личного номера
    const isPersonalNumberTaken =
      await this.employeeRepository.existsByPersonalNumber(dto.personalNumber);

    if (isPersonalNumberTaken) {
      throw new ConflictException('Личный номер занят');
    }

    // Проверяем наличие номера бригады
    const team = await this.teamRepository.findTeamByTeamNumber(dto.teamNumber);

    if (!team) {
      throw new NotFoundException('Номер бригады не найден');
    }

    // Проверяем существование штатной позиции
    const position = await this.positionRepository.findByPositionCode(
      dto.positionCode,
    );

    if (!position) {
      throw new NotFoundException('Штатная позиция не найдена');
    }

    // Проверяем совместимость цеха работника и цеха пользователя (только если не массовая операция)
    if (
      !isManyOperation &&
      position.workshop.workshopCode !== profileWorkshop
    ) {
      throw new ConflictException('Позиция из другого цеха');
    }

    // Проверяем дату рождения
    if (dto.birthDay > new Date()) {
      throw new BadRequestException('Дата рождения в будущем');
    }

    // Создаем аккаунт
    const { account, initialPassword } =
      await this.accountService.createAсcount(
        dto.lastName,
        dto.firstName,
        dto.patronymic,
      );

    // Формируем данные для создания сотрудника
    const data = {
      ...dto,
      position,
      team,
      account,
    };

    // Создаём сотрудника через репозиторий
    const employee = await this.employeeRepository.create(data);

    // Создаём связь сотрудника с ролью
    await this.employeeRoleRepository.create(employee.id, position.role.id);

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
    const employee = await this.employeeRepository.findEmployeeById(id);

    if (!employee) {
      throw new NotFoundException('Работник не найден');
    }

    // Проверяем уникальность ФИО
    const isFullNameTaken =
      await this.employeeRepository.existsByFullNameExcluding(
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
      await this.employeeRepository.existsByPersonalNumberExcluding(
        employee.id,
        dto.personalNumber,
      );

    if (isPersonalNumberTaken) {
      throw new ConflictException('Личный номер занят');
    }

    // Проверяем номер бригады
    const newTeam = await this.teamRepository.findTeamByTeamNumber(
      dto.teamNumber,
    );

    if (!newTeam) {
      throw new NotFoundException('№ бригады не найден');
    }

    // Проверяем штатную позицию
    const newPosition = await this.positionRepository.findByPositionCode(
      dto.positionCode,
    );

    if (!newPosition) {
      throw new NotFoundException('Позиция не найдена');
    }

    // Проверяем совместимость цеха работника и цеха пользователя
    if (newPosition.workshop.workshopCode !== profileWorkshop) {
      throw new ConflictException('Позиция из другого цеха');
    }

    // Проверяем дату рождения
    if (dto.birthDay > new Date()) {
      throw new BadRequestException('Дата рождения в будущем');
    }

    // Находим дефолтную роль (если нет роли работника)
    const position = await this.positionRepository.findByPositionCode(
      employee.position.positionCode,
    );

    if (!position) {
      throw new NotFoundException('Позиция не найдена');
    }

    // Находим новую роль по имени из DTO
    const newRole = await this.roleRepository.findByName(dto.role);

    if (!newRole) {
      throw new NotFoundException('Роль не найдена');
    }

    // Обновление полей сущности
    employee.lastName = dto.lastName;
    employee.firstName = dto.firstName;
    employee.patronymic = dto.patronymic;
    employee.personalNumber = dto.personalNumber;
    employee.team = newTeam;
    employee.position = newPosition;
    employee.birthDay = dto.birthDay;
    employee.startDate = dto.startDate;
    employee.endDate = dto.endDate;
    employee.isActive = dto.endDate ? false : true;

    if (dto.role) {
      employee.employeeRole.role = newRole;
    } else {
      employee.employeeRole.role = position.role;
    }

    await this.employeeRoleRepository.save(employee.employeeRole);
    await this.employeeRepository.save(employee);

    return this.getEmployeeInfo(employee.personalNumber);
  }

  async deleteEmployee(id: string, profileWorkshop: string): Promise<ISuccess> {
    // Находим работника
    const employee = await this.employeeRepository.findWithWorkshopCodeById(id);

    if (!employee) {
      throw new NotFoundException('Работник не найден');
    }

    // Сравниваем цеха из БД и профиля
    if (employee.position.workshop.workshopCode !== profileWorkshop) {
      throw new ConflictException('Позиция из другого цеха');
    }

    const result = await this.employeeRepository.remove(id);

    if (result.affected === 0) {
      throw new NotFoundException('Работник не найден');
    }

    return {
      message: 'Работник успешно удален',
    };
  }

  async getEmployeeInfo(personalNumber: string): Promise<IEmployeeInfo> {
    const employee =
      await this.employeeRepository.findByPersonalNumber(personalNumber);

    if (!employee) {
      throw new NotFoundException('Работник не найден');
    }

    return {
      id: employee.id,
      lastName: employee.lastName,
      firstName: employee.firstName,
      patronymic: employee.patronymic,
      workshop: employee.position.workshop.workshopCode,
      team: employee.team.teamNumber,
      profession: employee.position.profession.name,
      personalNumber: employee.personalNumber,
      positionCode: employee.position.positionCode,
      grade: employee.position.grade.gradeCode,
      schedule: employee.position.schedule.scheduleCode,
      birthDay: employee.birthDay,
      startDate: employee.startDate,
      endDate: employee.endDate,
      role: employee.employeeRole.role.name,
      isActive: employee.isActive,
    };
  }
}
