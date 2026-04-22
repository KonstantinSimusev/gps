import { IsNull, Not, Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Account } from './entities/account.entity';

@Injectable()
export class AccountsRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
  ) {}

  async create(accountData: Partial<Account>): Promise<Account> {
    const account = this.accountsRepository.create(accountData);
    return this.accountsRepository.save(account);
  }

  async update(
    id: string,
    accountData: Partial<Account>,
  ): Promise<UpdateResult> {
    return this.accountsRepository.update(id, accountData);
  }

  async findByLogin(login: string): Promise<Account | null> {
    return this.accountsRepository.findOne({
      where: {
        login,
        employee: {
          isActive: true,
        },
      },
    });
  }

  async findByEmployeeId(employeeId: string): Promise<Account | null> {
    return this.accountsRepository.findOne({
      where: {
        employee: {
          id: employeeId,
          isActive: true,
        },
      },
    });
  }

  // Получаем все аккаунты с установленным hashedRefreshToken
  async findByHashedRefreshToken(): Promise<Account[]> {
    return this.accountsRepository.find({
      where: {
        hashedRefreshToken: Not(IsNull()),
        employee: {
          isActive: true,
        },
      },
    });
  }
}
