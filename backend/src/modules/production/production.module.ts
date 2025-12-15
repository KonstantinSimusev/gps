import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Production } from './entities/production.entity';

import { ProductionRepository } from './production.repository';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';

import { AuthModule } from '../auth/auth.module';
import { ShiftModule } from '../shift/shift.module';
import { ResidueModule } from '../residue/residue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Production]),
    AuthModule,
    ResidueModule,
    forwardRef(() => ShiftModule),
  ],
  controllers: [ProductionController],
  providers: [ProductionRepository, ProductionService],
  exports: [ProductionService],
})
export class ProductionModule {}
