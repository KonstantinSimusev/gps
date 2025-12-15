import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Shipment } from './entities/shipment.entity';

@Injectable()
export class ShipmentRepository {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
  ) {}

  async create(shipment: Shipment): Promise<Shipment> {
    const newShipment = this.shipmentRepository.create(shipment);
    return await this.shipmentRepository.save(newShipment);
  }

  async findById(id: string): Promise<Shipment> {
    return await this.shipmentRepository.findOneBy({ id });
  }

  async update(
    shipment: Shipment,
    updateData: Partial<Shipment>,
  ): Promise<Shipment> {
    return await this.shipmentRepository.save({
      ...shipment,
      ...updateData,
    });
  }

  async findShipmentsByShiftId(shiftId: string): Promise<Shipment[]> {
    return this.shipmentRepository.find({
      where: {
        shift: {
          id: shiftId,
        },
      },
      order: {
        sortOrder: 'ASC', // сортировка по возрастанию (1, 2, 3, ...)
      },
    });
  }
}
