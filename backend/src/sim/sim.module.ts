import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { SimGateway } from "./sim.gateway";
import { SimService } from "./sim.service";
import { AllConfigType } from "src/config/config.type";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        secret: configService.getOrThrow('auth.secret', { infer: true }),
      }),
    }),
  ],
  providers: [SimService, SimGateway],
})
export class SimModule { }
