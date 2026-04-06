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

  async save(account: Account): Promise<Account> {
    return this.accountsRepository.save(account);
  }

  async updateByEmployeeId(
    accountId: string,
    login: string,
    hashedPassword: string,
  ): Promise<void> {
    await this.accountsRepository.update(
      accountId,
      {
        login,
        hashedPassword,
        hashedRefreshToken: null,
      },
    );
  }

  async updateHashedRefreshToken(
    accountId: string,
    hashedRefreshToken: string,
  ): Promise<void> {
    await this.accountsRepository.update(accountId, {
      hashedRefreshToken,
    });
  }

  async findAccountByLogin(login: string): Promise<Account | null> {
    return this.accountsRepository.findOne({
      where: {
        login,
        employee: {
          isActive: true,
        },
      },
      select: {
        id: true,
        hashedPassword: true,
      },
    });
  }

  async findAccountByEmployeeId(employeeId: string): Promise<Account | null> {
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
  async findAllByHashedRefreshToken(): Promise<Account[]> {
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
