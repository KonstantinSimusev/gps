import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { toDateString } from '../../shared/utils/utils';
import { ERole } from '../../shared/enums/enums';

import { Employee } from '../employee/entities/employee.entity';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateEmployeesDto } from './dto/create-employees.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

import {
  IAccountInfo,
  IEmployeeInfo,
  IList,
  IProfile,
} from '../../shared/interfaces/api.interface';

import { EmployeeRepository } from '../employee/employee.repository';

import { AccountService } from '../account/account.service';
import { GradeService } from '../grade/grade.service';
import { EmployeeService } from '../employee/employee.service';
import { PositionService } from '../position/position.service';
import { ScheduleService } from '../schedule/schedule.service';
import { TeamService } from '../team/team.service';

@Injectable()
export class EmployeeManagementService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,

    private readonly accountService: AccountService,
    private readonly employeeService: EmployeeService,
    private readonly gradeService: GradeService,
    private readonly positionService: PositionService,
    private readonly scheduleService: ScheduleService,
    private readonly teamService: TeamService,
  ) {}

  async createEmployee(
    dto: CreateEmployeeDto,
    profile?: IProfile,
    isManyOperation: boolean = false,
  ): Promise<IAccountInfo> {
    // Получаем сущности
    const team = await this.teamService.getTeam(dto.teamNumber);
    const grade = await this.gradeService.getGrade(dto.gradeCode);

    const schedule = await this.scheduleService.getScheduleByCode(
      dto.scheduleCode,
    );

    const position = await this.positionService.getPosition(
      dto.positionCode,
      grade.id,
      schedule.id,
    );

    // Проверяем, не занято ли ФИО
    await this.employeeService.validateUniqueFullName(
      dto.lastName,
      dto.firstName,
      dto.patronymic,
    );

    // Проверяем уникальность личного номера
    await this.employeeService.validateUniquePersonalNumber(dto.personalNumber);

    // Проверяем дату рождения
    if (dto.birthDay > new Date()) {
      throw new BadRequestException('Дата рождения в будущем');
    }

    // Проверяем совместимость цеха работника и цеха пользователя (только если не массовая операция)
    if (
      !isManyOperation &&
      position.workshop.workshopCode !== profile.workshopCode
    ) {
      throw new ConflictException('Позиция из другого цеха');
    }

    // Проверяем соответствие бригады и графика по штатной позиции
    await this.validateBaseTeamScheduleCompatibility(dto);

    // Проверяем условие - руководитель в бригаде может быть только один
    const role = position.role.name;

    if (
      role === ERole.HEAD ||
      role === ERole.LEAD_MASTER ||
      role === ERole.DETAIL_MASTER ||
      role === ERole.MASTER
    ) {
      await this.employeeService.existsTeamManager(
        team.id,
        position.workshop.id,
        position.schedule.id,
        position.role.id,
      );
    }

    // Создаем аккаунт
    const { account, initialPassword } =
      await this.accountService.createAсcount(
        dto.lastName,
        dto.firstName,
        dto.patronymic,
      );

    // Создаём сотрудника
    await this.employeeRepository.create({
      ...dto,
      position,
      team,
      account,
    });

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
      console.error('createMany failed:', error);

      throw new InternalServerErrorException('Не удалось создать работников');
    }
  }

  async updateEmployee(
    dto: UpdateEmployeeDto,
    profile: IProfile,
  ): Promise<IEmployeeInfo> {
    // Получаем сущности
    const employee = await this.employeeService.getEmployee(dto.id);

    const team = await this.teamService.getTeam(dto.teamNumber);
    const grade = await this.gradeService.getGrade(dto.gradeCode);

    const schedule = await this.scheduleService.getScheduleByCode(
      dto.scheduleCode,
    );

    const position = await this.positionService.getPosition(
      dto.positionCode,
      grade.id,
      schedule.id,
    );

    // Проверка цехов и изменений — выполняем до всех валидаций
    const isSameWorkshop =
      profile.workshopCode === position.workshop.workshopCode;
    const hasKlsChanges = this.hasKlsFieldsChanged(employee, dto);
    const hasCurrentChanges = this.hasCurrentFieldsChanged(employee, dto);

    // Если разные цеха
    if (!isSameWorkshop) {
      if (hasKlsChanges) {
        throw new ConflictException('Нельзя менять КЛС');
      }

      if (!hasCurrentChanges) {
        // Ничего не изменилось — возвращаем текущий статус
        return this.getEmployeeInfo(employee.personalNumber);
      }
    }
    // Если цеха одинаковые или изменились только current-поля при разных цехах — продолжаем

    // Проверяем уникальность ФИО
    await this.employeeService.validateUniqueFullNameExcluding(
      employee.id,
      dto.lastName,
      dto.firstName,
      dto.patronymic,
    );

    // Проверяем уникальность личного номера
    await this.employeeService.validateUniquePersonalNumberExcluding(
      employee.id,
      dto.personalNumber,
    );

    // Проверяем дубликаты в полях
    if (dto.teamNumber === dto.currentTeamNumber) {
      throw new ConflictException('Бригады совпадают');
    }

    // Проверяем дубликаты в полях
    if (dto.positionCode === dto.currentPositionCode) {
      throw new ConflictException('Позиции совпадают');
    }

    // Проверяем уволенного сотрудника и доступ в кабинет
    if (dto.endDate !== null && dto.hasAccess) {
      throw new ConflictException('Отключите доступ в кабинет');
    }

    // Проверяем дату рождения (не может быть в будущем)
    if (dto.birthDay > new Date()) {
      throw new BadRequestException('Дата рождения в будущем');
    }

    // Проверяем соответствие бригады и графика по штатной позиции
    await this.validateTeamScheduleCompatibility(dto);

    // Проверяем условие - руководитель в бригаде может быть только один
    await this.validateTeamManagerUpdate(employee, dto);

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

    // Проверка прав на обновление current-полей
    const currentPositionCode = dto.currentPositionCode ?? dto.positionCode;
    const currentGradeCode = dto.currentGradeCode ?? dto.gradeCode;
    const currentScheduleCode = dto.currentScheduleCode ?? dto.scheduleCode;

    const currentGrade = await this.gradeService.getGrade(currentGradeCode);

    const currentSchedule =
      await this.scheduleService.getScheduleByCode(currentScheduleCode);

    const currentPosition = await this.positionService.getPosition(
      currentPositionCode,
      currentGrade.id,
      currentSchedule.id,
    );

    const currentRole = currentPosition.role.name;

    const canUpdateCurrentFields = [
      ERole.HEAD,
      ERole.LEAD_MASTER,
      ERole.DETAIL_MASTER,
      ERole.MASTER,
    ].includes(currentRole as ERole);

    if (canUpdateCurrentFields) {
      // Обновление currentTeam
      if (dto.currentTeamNumber !== null) {
        const currentTeam = await this.teamService.getTeam(
          dto.currentTeamNumber,
        );
        employee.currentTeam = currentTeam;
      } else {
        employee.currentTeam = null;
      }

      // Обновление currentPosition
      if (dto.currentPositionCode !== null) {
        const currentGrade = await this.gradeService.getGrade(
          dto.currentGradeCode,
        );

        const currentSchedule = await this.scheduleService.getScheduleByCode(
          dto.currentScheduleCode,
        );

        const currentPosition = await this.positionService.getPosition(
          dto.currentPositionCode,
          currentGrade.id,
          currentSchedule.id,
        );

        employee.currentPosition = currentPosition;
      } else {
        employee.currentPosition = null;
      }
    } else {
      // Если роль не имеет прав на обновление current-полей, проверяем, что они не передаются
      if (dto.currentTeamNumber !== null || dto.currentPositionCode !== null) {
        throw new ForbiddenException(
          'Позиция - не руководитель',
        );
      }

      // Игнорируем current-поля, если они не переданы
      employee.currentTeam = employee.currentTeam;
      employee.currentPosition = employee.currentPosition;
    }

    // 5. Сохранение изменений
    await this.employeeRepository.save(employee);

    // 6. Возврат результата
    return this.getEmployeeInfo(employee.personalNumber);
  }

  async getEmployeeInfo(personalNumber: number): Promise<IEmployeeInfo> {
    const employee =
      await this.employeeService.getEmployeeByPersonalNumber(personalNumber);

    return {
      id: employee.id,

      lastName: employee.lastName,
      firstName: employee.firstName,
      patronymic: employee.patronymic,
      profession: employee.position.profession.name,

      workshop: employee.position.workshop.workshopCode,
      teamNumber: employee.team.teamNumber,
      personalNumber: employee.personalNumber,
      positionCode: employee.position.positionCode,
      gradeCode: employee.position.grade.gradeCode,
      scheduleCode: employee.position.schedule.scheduleCode,

      currentTeamNumber: employee.currentTeam?.teamNumber ?? null,
      currentPositionCode: employee.currentPosition?.positionCode ?? null,
      currentGradeCode: employee.currentPosition?.grade?.gradeCode ?? null,
      currentScheduleCode:
        employee.currentPosition?.schedule?.scheduleCode ?? null,

      birthDay: employee.birthDay,
      startDate: employee.startDate,
      endDate: employee.endDate,
      isActive: employee.isActive,

      role: employee.currentPosition?.role.name ?? employee.position.role.name,

      hasAccess: employee.hasAccess,
    };
  }

  private hasKlsFieldsChanged(
    employee: Employee,
    dto: UpdateEmployeeDto,
  ): boolean {
    return (
      employee.lastName !== dto.lastName ||
      employee.firstName !== dto.firstName ||
      employee.patronymic !== dto.patronymic ||
      employee.personalNumber !== dto.personalNumber ||
      employee.team.teamNumber !== dto.teamNumber ||
      employee.position.positionCode !== dto.positionCode ||
      employee.position.grade.gradeCode !== dto.gradeCode ||
      employee.position.schedule.scheduleCode !== dto.scheduleCode ||
      toDateString(employee.birthDay) !== toDateString(dto.birthDay) ||
      toDateString(employee.startDate) !== toDateString(dto.startDate) ||
      toDateString(employee.endDate) !== toDateString(dto.endDate)
    );
  }

  private hasCurrentFieldsChanged(
    employee: Employee,
    dto: UpdateEmployeeDto,
  ): boolean {
    return (
      employee.hasAccess !== dto.hasAccess ||
      employee.currentTeam?.teamNumber !== dto.currentTeamNumber ||
      employee.currentPosition?.positionCode !== dto.currentPositionCode ||
      employee.currentPosition?.grade?.gradeCode !== dto.currentGradeCode ||
      employee.currentPosition?.schedule?.scheduleCode !==
        dto.currentScheduleCode
    );
  }

  private SCHEDULE_TEAM_RULES: Record<string, number[]> = {
    '2': [1, 2, 3, 4],
    '2-А': [1, 2, 3, 4],
    '5-Б-1': [5],
    '9': [1, 2],
  };

  private async validateBaseTeamScheduleCompatibility(
    dto: CreateEmployeeDto,
  ): Promise<void> {
    const grade = await this.gradeService.getGrade(dto.gradeCode);
    const schedule = await this.scheduleService.getScheduleByCode(
      dto.scheduleCode,
    );

    const position = await this.positionService.getPosition(
      dto.positionCode,
      grade.id,
      schedule.id,
    );

    // Получаем допустимые бригады для графика
    const allowedTeams =
      this.SCHEDULE_TEAM_RULES[position.schedule.scheduleCode];

    // Проверяем, входит ли бригада в список допустимых
    if (!allowedTeams.includes(dto.teamNumber)) {
      throw new ConflictException('Позиция не соответствует бригаде');
    }
  }

  private async validateTeamScheduleCompatibility(
    dto: UpdateEmployeeDto,
  ): Promise<void> {
    const teamNumber = dto.currentTeamNumber ?? dto.teamNumber;
    const dtoPositionCode = dto.currentPositionCode ?? dto.positionCode;
    const dtoGradeCode = dto.currentGradeCode ?? dto.gradeCode;
    const dtoScheduleCode = dto.currentScheduleCode ?? dto.scheduleCode;

    const grade = await this.gradeService.getGrade(dtoGradeCode);
    const schedule =
      await this.scheduleService.getScheduleByCode(dtoScheduleCode);

    const position = await this.positionService.getPosition(
      dtoPositionCode,
      grade.id,
      schedule.id,
    );

    // Получаем допустимые бригады для графика
    const allowedTeams =
      this.SCHEDULE_TEAM_RULES[position.schedule.scheduleCode];

    // Проверяем, входит ли бригада в список допустимых
    if (!allowedTeams.includes(teamNumber)) {
      throw new ConflictException('Позиция не соответствует бригаде');
    }
  }

  private async validateTeamManagerUpdate(
    employee: Employee,
    dto: UpdateEmployeeDto,
  ): Promise<void> {
    const currentPositionCode = dto.currentPositionCode ?? dto.positionCode;
    const currentGradeCode = dto.currentGradeCode ?? dto.gradeCode;
    const currentScheduleCode = dto.currentScheduleCode ?? dto.scheduleCode;

    const currentGrade = await this.gradeService.getGrade(currentGradeCode);

    const currentSchedule =
      await this.scheduleService.getScheduleByCode(currentScheduleCode);

    const currentPosition = await this.positionService.getPosition(
      currentPositionCode,
      currentGrade.id,
      currentSchedule.id,
    );

    const currentRole = currentPosition.role.name;

    if (
      (currentRole === ERole.HEAD ||
        currentRole === ERole.LEAD_MASTER ||
        currentRole === ERole.DETAIL_MASTER ||
        currentRole === ERole.MASTER) &&
      dto.hasAccess === true
    ) {
      const currentTeamNumber = dto.currentTeamNumber ?? dto.teamNumber;
      const currentTeam = await this.teamService.getTeam(currentTeamNumber);

      await this.employeeService.existsTeamManagerExcluding(
        employee.id,
        currentTeam.id,
        currentPosition.workshop.id,
        currentPosition.schedule.id,
        currentPosition.role.id,
      );
    }
  }
}
