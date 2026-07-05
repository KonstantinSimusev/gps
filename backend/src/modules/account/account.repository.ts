import { IsNull, Not, Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Account } from './entities/account.entity';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  // 1. CRUD: Create
  async create(data: Partial<Account>): Promise<Account> {
    const account = this.accountRepository.create(data);
    return this.accountRepository.save(account);
  }

  // 2. CRUD: Read (общие методы поиска)
  async findByLogin(login: string): Promise<Account | null> {
    return this.accountRepository.findOne({
      where: {
        login,
        employee: {
          hasAccess: true,
          isActive: true,
        },
      },
      relations: [
        'employee',
        'employee.team',
        'employee.currentTeam',
        'employee.position',
        'employee.position.workshop',
        'employee.position.profession',
        'employee.position.schedule',
        'employee.position.role',
        'employee.currentPosition',
        'employee.currentPosition.workshop',
        'employee.currentPosition.schedule',
        'employee.currentPosition.role',
        'employee.employeeRole',
        'employee.employeeRole.role',
      ],
      select: {
        id: true,
        hashedPassword: true,
        employee: {
          id: true,
          lastName: true,
          firstName: true,
          patronymic: true,
          team: {
            id: true,
            teamNumber: true,
          },
          currentTeam: {
            id: true,
            teamNumber: true,
          },
          position: {
            id: true,
            workshop: {
              id: true,
              workshopCode: true,
            },
            profession: {
              id: true,
              name: true,
            },
            schedule: {
              id: true,
              scheduleCode: true,
            },
            role: {
              id: true,
              name: true,
            },
          },
          currentPosition: {
            id: true,
            workshop: {
              id: true,
              workshopCode: true,
            },
            profession: {
              id: true,
              name: true,
            },
            schedule: {
              id: true,
              scheduleCode: true,
            },
            role: {
              id: true,
              name: true,
            },
          },
          employeeRole: {
            id: true,
            role: {
              id: true,
              name: true,
            },
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Account | null> {
    return this.accountRepository.findOne({
      where: {
        id,
        employee: {
          hasAccess: true,
          isActive: true,
        },
      },
      relations: [
        'employee',
        'employee.team',
        'employee.currentTeam',
        'employee.position',
        'employee.position.workshop',
        'employee.position.profession',
        'employee.position.schedule',
        'employee.position.role',
        'employee.currentPosition',
        'employee.currentPosition.workshop',
        'employee.currentPosition.schedule',
        'employee.currentPosition.role',
        'employee.employeeRole',
        'employee.employeeRole.role',
      ],
      select: {
        id: true,
        hashedPassword: true,
        employee: {
          id: true,
          lastName: true,
          firstName: true,
          patronymic: true,
          team: {
            id: true,
            teamNumber: true,
          },
          currentTeam: {
            id: true,
            teamNumber: true,
          },
          position: {
            id: true,
            workshop: {
              id: true,
              workshopCode: true,
            },
            profession: {
              id: true,
              name: true,
            },
            schedule: {
              id: true,
              scheduleCode: true,
            },
            role: {
              id: true,
              name: true,
            },
          },
          currentPosition: {
            id: true,
            workshop: {
              id: true,
              workshopCode: true,
            },
            profession: {
              id: true,
              name: true,
            },
            schedule: {
              id: true,
              scheduleCode: true,
            },
            role: {
              id: true,
              name: true,
            },
          },
          employeeRole: {
            id: true,
            role: {
              id: true,
              name: true,
            },
          },
        },
      },
    });
  }

  // Получаем все аккаунты с установленным hashedRefreshToken
  async findByHashedRefreshToken(): Promise<Account[]> {
    return this.accountRepository.find({
      where: {
        hashedRefreshToken: Not(IsNull()),
        employee: {
          hasAccess: true,
          isActive: true,
        },
      },
      select: {
        id: true,
        hashedRefreshToken: true,
      },
    });
  }

  // 3. CRUD: Update
  async update(id: string, data: Partial<Account>): Promise<UpdateResult> {
    return this.accountRepository.update(id, data);
  }
}
