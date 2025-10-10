import { Module } from "@nestjs/common";
import { UsersModule } from "./modules/users/users.module";
import { UsersController } from "./modules/users/users.controller";
import { UsersService } from "./modules/users/users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./modules/auth/auth.module";
import { AuthController } from "./modules/auth/auth.controller";
import { mongoConfig } from "./shared/infra/database/database";
import { AuthService } from "./modules/auth/auth.service";

@Module({
  imports: [
    MongooseModule.forRootAsync(mongoConfig),
    UsersModule,
    AuthModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [UsersService, AuthService],
})
export class AppModule {}
