import {
  UpdateDateColumn,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Profiles } from './profiles.entity';

@Entity('Job')
export class Job {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  message?: string;

  @Column({
    nullable: true,
  })
  screenshot_folder?: string;

  @Column({ nullable: true })
  flow_process: string;

  @ManyToOne(() => Profiles, (profile) => profile.fkJob, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    {
      name: 'fkProfiles',
      foreignKeyConstraintName: 'fkProfiles',
      referencedColumnName: 'id',
    },
  ])
  fkProfiles: Profiles;

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

  @Column({
    nullable: true,
  })
  errors?: string;

  @Column({
    nullable: true,
  })
  channel_idMessage?: number;

  @Column({
    nullable: true,
  })
  channel_message?: string;

  @Column({
    nullable: true,
  })
  channel_peerId?: string;

  @Column({
    nullable: true,
  })
  channel_editDate?: Date;
}
