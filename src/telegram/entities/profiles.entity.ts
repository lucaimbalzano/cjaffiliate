import {
  UpdateDateColumn,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Job } from './job.entity';

@Entity('Profiles')
export class Profiles {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  email: string;

  @Column({
    nullable: false,
  })
  number: string;

  @Column({ nullable: false, default: '+39' })
  prefix: string;

  @Column({ nullable: false, default: true })
  availability_number: boolean;

  @Column({ nullable: false, default: true })
  availability_email: boolean;

  @OneToMany(() => Job, (job) => job.fkProfiles)
  @JoinColumn({ name: 'fkJob' })
  fkJob: Job[];

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
