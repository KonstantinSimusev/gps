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
      relations: this.ACCOUNT_RELATIONS,
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
      relations: this.ACCOUNT_RELATIONS,
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

  private ACCOUNT_RELATIONS = [
    'employee',
    'employee.team',
    'employee.position',
    'employee.position.workshop',
    'employee.position.profession',
    'employee.position.grade',
    'employee.position.schedule',
    'employee.position.paymentSystem',
    'employee.position.role',
    'employee.profileTeam',
    'employee.profilePosition',
    'employee.profilePosition.workshop',
    'employee.profilePosition.profession',
    'employee.profilePosition.grade',
    'employee.profilePosition.schedule',
    'employee.profilePosition.paymentSystem',
    'employee.profilePosition.role',
  ];
}
