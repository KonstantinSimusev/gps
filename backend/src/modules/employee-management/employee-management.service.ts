import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { ERole } from '../../shared/enums/enums';

import { Employee } from '../employee/entities/employee.entity';
import { Position } from '../position/entities/position.entity';
import { Team } from '../team/entities/team.entity';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateEmployeesDto } from './dto/create-employees.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

import {
  IAccountInfo,
  IEmployeeInfo,
  IList,
  IProfile,
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
    profile?: IProfile,
    isManyOperation: boolean = false,
  ): Promise<IAccountInfo> {
    // Проверяем права на данную операцию
    if (!isManyOperation && profile.role !== ERole.ADMIN) {
      throw new ForbiddenException('Недостаточно прав');
    }

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
      position.workshop.workshopCode !== profile.workshopCode
    ) {
      throw new ConflictException('Позиция из другого цеха');
    }

    // Проверяем дату рождения
    if (dto.birthDay > new Date()) {
      throw new BadRequestException('Дата рождения в будущем');
    }

    // Проверяем условие - мастер в бригаде может быть только один
    await this.validateMasterRoleCreate(dto);

    // Проверяем соответствие бригады и графика по штатной позиции
    await this.validateBaseTeamScheduleCompatibility(
      team.teamNumber,
      position.positionCode,
    );

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
    await this.employeeRepository.create(data);

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
      throw new InternalServerErrorException('Не удалось создать работников');
    }
  }

  async updateEmployee(
    id: string,
    dto: UpdateEmployeeDto,
    profile: IProfile,
  ): Promise<IEmployeeInfo> {
    // 1. Получение сущностей
    const employee = await this.getEmployee(id);
    const team = await this.getTeam(dto.teamNumber);
    const position = await this.getPosition(dto.positionCode);
    const currentTeam = await this.getTeam(dto.currentTeamNumber);
    const currentPosition = await this.getPosition(dto.currentPositionCode);

    // 2. Валидация
    this.validateDuplicate(dto);
    this.validateBirthDate(dto.birthDay);
    this.validateWorkshopIdentity(profile, position);
    this.validateRequiredRole(profile.role, ERole.ADMIN);

    await this.validateMasterRoleUpdate(employee, dto);
    await this.validateUniqueFullName(employee, dto);
    await this.validateUniquePersonalNumber(employee, dto);
    await this.validateTeamScheduleCompatibility(dto);
    await this.validateBaseTeamScheduleCompatibility(
      dto.teamNumber,
      dto.positionCode,
    );

    // 3. Обновление полей
    employee.lastName = dto.lastName;
    employee.firstName = dto.firstName;
    employee.patronymic = dto.patronymic;
    employee.personalNumber = dto.personalNumber;
    employee.birthDay = dto.birthDay;
    employee.startDate = dto.startDate;
    employee.endDate = dto.endDate;
    employee.hasAccess = dto.endDate !== null ? false : dto.hasAccess;
    employee.isActive = dto.endDate === null;

    // 4. Обновление связей
    employee.team = team;
    employee.position = position;
    employee.currentTeam = currentTeam;
    employee.currentPosition = currentPosition;

    // 4.1. Управление ролью работника
    await this.manageEmployeeRole(employee, dto.role);

    // 5. Сохранение изменений
    await this.employeeRepository.save(employee);

    // 6. Возврат результата
    return this.getEmployeeInfo(employee.personalNumber);
  }

  async deleteEmployee(id: string, profile: IProfile): Promise<ISuccess> {
    // Проверяем права на данную операцию
    if (profile.role !== ERole.ADMIN) {
      throw new ForbiddenException('Недостаточно прав');
    }

    // Находим работника
    const employee = await this.employeeRepository.findWithWorkshopCodeById(id);

    if (!employee) {
      throw new NotFoundException('Работник не найден');
    }

    // Проверяем совместимость цехов сотрудника и администратора
    if (employee.position.workshop.workshopCode !== profile.workshopCode) {
      throw new ConflictException('Сотрудник из другого цеха');
    }

    const result = await this.employeeRepository.remove(id);

    if (result.affected === 0) {
      throw new NotFoundException('Работник не найден');
    }

    return {
      message: 'Работник успешно удален',
    };
  }

  async getEmployeeInfo(personalNumber: number): Promise<IEmployeeInfo> {
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
      teamNumber: employee.team.teamNumber,
      profession: employee.position.profession.name,
      personalNumber: employee.personalNumber,
      positionCode: employee.position.positionCode,
      grade: employee.position.grade.gradeCode,
      schedule: employee.position.schedule.scheduleCode,
      birthDay: employee.birthDay,
      startDate: employee.startDate,
      endDate: employee.endDate,
      hasAccess: employee.hasAccess,
      isActive: employee.isActive,

      currentTeamNumber: employee.currentTeam?.teamNumber ?? null,
      currentPositionCode: employee.currentPosition?.positionCode ?? null,

      role:
        employee.employeeRole?.role?.name ??
        employee.currentPosition?.role.name ??
        employee.position.role.name,
    };
  }

  // Приватные методы

  // Получение сущностей

  private async getEmployee(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findEmployeeById(id);

    if (!employee) {
      throw new NotFoundException('Работник не найден');
    }

    return employee;
  }

  private async getTeam(teamNumber: number | null): Promise<Team | null> {
    if (teamNumber === null) {
      return null;
    }

    const team = await this.teamRepository.findTeamByTeamNumber(teamNumber);

    if (!team) {
      throw new NotFoundException('Номер бригады не найден');
    }

    return team;
  }

  private async getPosition(code: number | null): Promise<Position | null> {
    if (code === null) {
      return null;
    }

    const position = await this.positionRepository.findByPositionCode(code);

    if (!position) {
      throw new NotFoundException('Позиция не найдена');
    }

    return position;
  }

  private async manageEmployeeRole(
    employee: Employee,
    roleName: string | null,
  ): Promise<void> {
    // Если роль удаляется
    if (roleName === null) {
      if (employee.employeeRole) {
        await this.employeeRoleRepository.remove(employee.employeeRole.id);
        employee.employeeRole = null;
      }

      return;
    }

    // Ищем роль по имени
    const role = await this.roleRepository.findByName(roleName);

    if (!role) {
      throw new NotFoundException('Роль не найдена');
    }

    // Проверяем, не та же самая роль (избегаем лишних операций)
    if (employee.employeeRole && employee.employeeRole.role.id === role.id) {
      return; // Роль не изменилась
    }

    // Удаляем старую роль, если есть
    if (employee.employeeRole) {
      await this.employeeRoleRepository.remove(employee.employeeRole.id);
    }

    // Создаём новую роль
    const newEmployeeRole = await this.employeeRoleRepository.create(
      employee.id,
      role.id,
    );

    await this.employeeRoleRepository.save(newEmployeeRole);
    employee.employeeRole = newEmployeeRole;
  }

  // Бизнес-валидация

  private async validateUniqueFullName(
    employee: Employee,
    dto: UpdateEmployeeDto,
  ): Promise<void> {
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
  }

  private async validateUniquePersonalNumber(
    employee: Employee,
    dto: UpdateEmployeeDto,
  ): Promise<void> {
    const isPersonalNumberTaken =
      await this.employeeRepository.existsByPersonalNumberExcluding(
        employee.id,
        dto.personalNumber,
      );

    if (isPersonalNumberTaken) {
      throw new ConflictException('Личный номер занят');
    }
  }

  private validateBirthDate(birthDay: Date): void {
    if (birthDay > new Date()) {
      throw new BadRequestException('Дата рождения в будущем');
    }
  }

  private validateRequiredRole(role: string, requiredRole: ERole): void {
    if (role !== requiredRole) {
      throw new ForbiddenException('Недостаточно прав');
    }
  }

  private validateWorkshopIdentity(
    profile: IProfile,
    position: Position,
  ): void {
    if (profile.workshopCode !== position.workshop.workshopCode) {
      throw new ConflictException('Позиция из другого цеха');
    }
  }

  private validateDuplicate(dto: UpdateEmployeeDto): void {
    if (dto.teamNumber === dto.currentTeamNumber) {
      throw new ConflictException('Бригады совпадают');
    }

    if (dto.positionCode === dto.currentPositionCode) {
      throw new ConflictException('Позиции совпадают');
    }
  }

  private readonly SCHEDULE_TEAM_RULES: Record<string, number[]> = {
    '2': [1, 2, 3, 4],
    '2-А': [1, 2, 3, 4],
    '5-Б-1': [5],
    '9': [1, 2],
  };

  private async validateBaseTeamScheduleCompatibility(
    teamNumber: number,
    positionCode: number,
  ): Promise<void> {
    const position = await this.getPosition(positionCode);
    const scheduleCode = position.schedule.scheduleCode;

    // Получаем допустимые бригады для графика
    const allowedTeams = this.SCHEDULE_TEAM_RULES[scheduleCode];

    // Проверяем, входит ли бригада в список допустимых
    if (!allowedTeams.includes(teamNumber)) {
      throw new ConflictException('Позиция не соответствует бригаде');
    }
  }

  private async validateTeamScheduleCompatibility(
    dto: UpdateEmployeeDto,
  ): Promise<void> {
    const teamNumber = dto.currentTeamNumber ?? dto.teamNumber;
    const positionCode = dto.currentPositionCode ?? dto.positionCode;
    const position = await this.getPosition(positionCode);
    const scheduleCode = position.schedule.scheduleCode;

    // Получаем допустимые бригады для графика
    const allowedTeams = this.SCHEDULE_TEAM_RULES[scheduleCode];

    // Проверяем, входит ли бригада в список допустимых
    if (!allowedTeams.includes(teamNumber)) {
      throw new ConflictException('Позиция не соответствует бригаде');
    }
  }

  private async validateMasterRoleCreate(
    dto: CreateEmployeeDto,
  ): Promise<void> {
    const team = await this.getTeam(dto.teamNumber);
    const position = await this.getPosition(dto.positionCode);
    const role = position.role.name;

    // Проверяем условие - мастер в бригаде может быть только один
    if (
      role === ERole.LEAD_MASTER ||
      role === ERole.DETAIL_MASTER ||
      role === ERole.MASTER
    ) {
      const isMasterTaken =
        await this.employeeRepository.existsCurrentMasterCreate(
          team.id,
          position.workshop.id,
        );

      if (isMasterTaken) {
        throw new ConflictException('Роль мастера уже занята');
      }
    }
  }

  private async validateMasterRoleUpdate(
    employee: Employee,
    dto: UpdateEmployeeDto,
  ): Promise<void> {
    const dtoTeam = dto.currentTeamNumber ?? dto.teamNumber;
    const dtoPosition = dto.currentPositionCode ?? dto.positionCode;
    const team = await this.getTeam(dtoTeam);
    const position = await this.getPosition(dtoPosition);
    const role = position.role.name;

    // Проверяем условие - мастер в бригаде может быть только один
    if (
      role === ERole.LEAD_MASTER ||
      role === ERole.DETAIL_MASTER ||
      role === ERole.MASTER
    ) {
      const isMasterTaken =
        await this.employeeRepository.existsCurrentMasterUpdate(
          employee.id,
          team.id,
          position.workshop.id,
        );

      if (isMasterTaken) {
        throw new ConflictException('Роль мастера уже занята');
      }
    }
  }
}
