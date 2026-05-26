import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SimModule } from './sim/sim.module';

import authConfig from './auth/config.type';
import databaseConfig from './database/config.type';

import { UserEntity } from './users/users.entity';
import { AllConfigType } from './config/config.type';
import { Room } from './rooms/room.entity';
import { Membership } from './rooms/membership.entity';
import {RoomsModule} from "./rooms/rooms.module";
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<AllConfigType>,
      ): TypeOrmModuleOptions => ({
        type: configService.get('database.type', { infer: true }) as any,
        url: configService.get<string>('database.url', { infer: true }),

        host: configService.get<string>('database.host', { infer: true }),
        port: configService.get('database.port', { infer: true }),

        username: configService.get<string>('database.username', {
          infer: true,
        }),

        password: configService.get<string>('database.password', {
          infer: true,
        }) as string,

        database: configService.get<string>('database.name', {
          infer: true,
        }),

        synchronize: configService.get('database.synchronize',
          { infer: true },
        ),

        entities: [UserEntity, Room, Membership, Event],
      }),
    }),
   
    UsersModule,
    AuthModule,
    SimModule,
    RoomsModule
  ],
})
export class AppModule { }
