import { IsNull, Not, Repository } from 'typeorm';
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

  async update(id: string, updateData: Partial<Account>): Promise<void> {
    this.accountsRepository.update(id, updateData);
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
