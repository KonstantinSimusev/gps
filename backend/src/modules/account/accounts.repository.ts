import { Repository, UpdateResult } from 'typeorm';
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

  async findByLogin(login: string): Promise<Account> {
    return this.accountsRepository.findOne({ where: { login } });
  }

  async update(id: string, updateData: Partial<Account>): Promise<void> {
    this.accountsRepository.update(id, updateData);
  }
}
