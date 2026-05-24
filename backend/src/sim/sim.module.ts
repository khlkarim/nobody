import { Module } from "@nestjs/common";
import { SimGateway } from "./sim.gateway";
import { SimService } from "./sim.service";

@Module({
  providers: [SimService, SimGateway]
})
export class SimModule { }
