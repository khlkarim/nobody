import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from '../users/users.entity';
import { Membership } from './membership.entity';

@ObjectType()
@Entity()
export class Room {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;
  
  @Column('uuid')
  creatorId!: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'creatorId' })
  creator!: UserEntity;

  @Field(() => [Membership])
  @OneToMany(() => Membership, (m) => m.room, { cascade: true })
  memberships!: Membership[];
}