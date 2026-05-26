import {
  Column,
  Entity,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserIcon } from './users.enums';
import { Membership } from '../rooms/membership.entity';
@Entity({
  name: 'user',
})
@ObjectType()
export class UserEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Field()
  @Column()
  firstName!: string;

  @Field()
  @Column()
  lastName!: string;

  @Field()
  @CreateDateColumn({ update: false })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field()
  @Column({ default: '#ffffff' })
  color: string;

  @Field()
  @Column({ default: UserIcon.CIRCLE })
  icon: UserIcon;

  @Field()
  @DeleteDateColumn()
  deletedAt!: Date;

  @Field(() => [Membership])
  @OneToMany(() => Membership, (m) => m.user)
  memberships!: Membership[];
}
