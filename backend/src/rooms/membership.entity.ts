import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { Room } from './room.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Membership {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column('uuid')
  userId!: string;

  @Field()
  @Column('uuid')
  roomId!: string;

  @Field()
  @CreateDateColumn()
  joinedAt!: Date;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Field(() => Room)
  @ManyToOne(() => Room, (r) => r.memberships)
  @JoinColumn({ name: 'roomId' })
  room!: Room;
}