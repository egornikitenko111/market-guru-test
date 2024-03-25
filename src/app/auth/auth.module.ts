import { HasherModule, JsonWebTokenModule } from "@common/helpers";
import { AccessTokenStrategy, RefreshTokenStrategy } from "@common/strategies";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { UserModule } from "../user/user.module";
import { UserSessionModule } from "../user-session/user-session.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [HasherModule, JsonWebTokenModule, PassportModule, UserModule, UserSessionModule],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
    exports: [AuthService],
})
export class AuthModule {}
