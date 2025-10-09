import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UserModule } from "./user/user.module";
import { AuthController } from "./auth/auth.controller";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [UserModule, AuthModule],
  controllers: [UsersController, AuthController],
  providers: [UsersService],
})
export class UsersModule {}
