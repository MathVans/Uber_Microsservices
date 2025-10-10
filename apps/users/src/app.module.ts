import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./modules/users/users.module";
import { UsersController } from "./modules/users/users.controller";
import { UsersService } from "./modules/users/users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./modules/auth/auth.module";
import { AuthController } from "./modules/auth/auth.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env.users",
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_URL"),
        dbName: configService.get<string>("MONGO_DB"),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, AuthController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
