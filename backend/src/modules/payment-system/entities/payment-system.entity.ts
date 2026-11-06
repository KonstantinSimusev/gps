import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Position } from '../../position/entities/position.entity';

@Entity({
  schema: 'gps',
  name: 'payment_systems',
})
export class PaymentSystem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'payment_code',
    type: 'varchar',
    length: 10,
    nullable: false,
    unique: true,
  })
  paymentCode: string; // ПП, ППИ, КСП, СКП, СПИ

  @Column({
    name: 'description',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  description: string; // Полное название

  // Связь: одна система оплаты — много позиций
  @OneToMany(() => Position, (position) => position.paymentSystem)
  positions: Position[];
}
