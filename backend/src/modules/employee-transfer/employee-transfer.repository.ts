// import { Repository } from 'typeorm';
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';

// import { EmployeeTransfer } from './entities/employee-transfer.entity';

// @Injectable()
// export class EmployeeTransferRepository {
//   constructor(
//     @InjectRepository(EmployeeTransfer)
//     private readonly employeeTransferRepository: Repository<EmployeeTransfer>,
//   ) {}

//   // 2. CRUD: Read (общие методы поиска)
//   // async findByPositionCode(positionCode: number): Promise<Position | null> {
//   //   return this.positionRepository.findOne({
//   //     where: { positionCode },
//   //     relations: ['workshop', 'schedule', 'role'],
//   //   });
//   // }
// }
