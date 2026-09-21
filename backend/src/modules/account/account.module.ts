import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from './entities/account.entity';

import { AccountRepository } from './account.repository';
import { AccountService } from './account.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  controllers: [],
  providers: [AccountRepository, AccountService],
  exports: [AccountRepository, AccountService],
})
export class AccountModule {}
