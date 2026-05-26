import { Module } from '@nestjs/common';
import { UserEntity } from './users.entity';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
  exports: [UsersService]
})
export class UsersModule { }
