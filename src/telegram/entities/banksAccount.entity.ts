import {
  UpdateDateColumn,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Banks_Account')
export class Banks_Account {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  iban: string;

  @Column({
    nullable: false,
  })
  heading: string;

  @Column({ nullable: false, default: true })
  availability: boolean;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'now()',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'now()',
    nullable: true,
  })
  updatedAt?: Date;
}
