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
          isActive: true,
        },
      },
      relations: [
        'employee',
        'employee.team',
        'employee.position',
        'employee.position.workshop',
        'employee.employeeRole',
        'employee.employeeRole.role',
      ],
      select: {
        id: true,
        hashedPassword: true,
        employee: {
          id: true,
          team: {
            id: true,
            teamNumber: true,
          },
          position: {
            id: true,
            workshop: {
              id: true,
              workshopCode: true,
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
          isActive: true,
        },
      },
      relations: [
        'employee',
        'employee.team',
        'employee.position',
        'employee.position.workshop',
        'employee.employeeRole',
        'employee.employeeRole.role',
      ],
      select: {
        id: true,
        employee: {
          id: true,
          team: {
            id: true,
            teamNumber: true,
          },
          position: {
            id: true,
            workshop: {
              id: true,
              workshopCode: true,
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
