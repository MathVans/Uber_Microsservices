import { Module } from "@nestjs/common";
import { UsersModule } from "./modules/users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./modules/auth/auth.module";
import { mongoConfig } from "./shared/infra/database/database";

@Module({
  imports: [
    MongooseModule.forRootAsync(mongoConfig),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
