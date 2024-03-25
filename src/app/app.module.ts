import { AccessTokenGuard } from "@common/guards";
import { DatabaseModule } from "@common/helpers";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { getEnvPath } from "@utils/functions";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [getEnvPath()],
            cache: true,
            isGlobal: true,
            expandVariables: true,
        }),
        DatabaseModule.forRoot(),
        AuthModule,
        UserModule,
    ],
    providers: [{ provide: APP_GUARD, useClass: AccessTokenGuard }],
})
export class AppModule {}
