import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Residue } from './entities/residue.entity';

import { ResidueRepository } from './residue.repository';
import { ResidueService } from './residue.service';
import { ResidueController } from './residue.controller';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Residue]), AuthModule],
  controllers: [ResidueController],
  providers: [ResidueRepository, ResidueService],
  exports: [ResidueRepository, ResidueService],
})
export class ResidueModule {}
