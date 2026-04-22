import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from './entities/account.entity';
import { AccountService } from './account.service';
import { AccountsRepository } from './accounts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  controllers: [],
  providers: [AccountService, AccountsRepository],
  exports: [AccountService, AccountsRepository],
})
export class AccountsModule {}
