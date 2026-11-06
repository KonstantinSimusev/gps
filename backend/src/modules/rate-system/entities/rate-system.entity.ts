import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Position } from '../../position/entities/position.entity';

@Entity({
  schema: 'gps',
  name: 'rate_systems',
})
export class RateSystem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'rate_code',
    type: 'varchar',
    length: 10,
    nullable: false,
    unique: true,
  })
  rateCode: string; // ПП, ППИ, КСП, СКП, СПИ

  @Column({
    name: 'rate_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  rateName: string; // Полное название

  @Column({
    name: 'rate_number',
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: false,
  })
  rateNumber: number; // 1.35 — сразу число для расчётов

  // Связь: одна система оплаты — много позиций
  @OneToMany(() => Position, (position) => position.rateSystem)
  positions: Position[];
}
