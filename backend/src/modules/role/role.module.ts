import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from './entities/role.entity';
import { RoleRepository } from './role.repository';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [],
  providers: [RoleRepository, RoleService],
  exports: [RoleRepository, RoleService],
})
export class RoleModule {}
