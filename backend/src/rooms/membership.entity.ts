import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { Room } from './room.entity';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column('uuid')
  roomId!: string;

  @CreateDateColumn()
  joinedAt!: Date;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @ManyToOne(() => Room, (r) => r.memberships)
  @JoinColumn({ name: 'roomId' })
  room!: Room;
}