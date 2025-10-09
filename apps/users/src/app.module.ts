import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthController } from "./auth/auth.controller";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { UsersController } from "./users/users.controller";
import { UsersService } from "./users/users.service";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
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
