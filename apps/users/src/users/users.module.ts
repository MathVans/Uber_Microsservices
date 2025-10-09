import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { ConfigService } from "@nestjs/config";
let config = new ConfigService();



@Module({
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
