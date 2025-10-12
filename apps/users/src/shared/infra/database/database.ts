import { ConfigModule, ConfigService } from "@nestjs/config";

export const mongoConfig = {
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env.users" }),
    ],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_URL"),
        dbName: configService.get<string>("MONGO_DB"),
    }),
};
