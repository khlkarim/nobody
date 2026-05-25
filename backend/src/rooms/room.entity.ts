import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { UserEntity } from '../users/users.entity';
import { Membership } from './membership.entity';

// 1. Removed @ObjectType()
@Entity()
export class Room {
  // 2. Removed @Field() decorators
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt!: Date;
  
  @Column('uuid')
  creatorId!: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'creatorId' })
  creator!: UserEntity;

  @OneToMany(() => Membership, (m) => m.room, { cascade: true })
  memberships!: Membership[];
}