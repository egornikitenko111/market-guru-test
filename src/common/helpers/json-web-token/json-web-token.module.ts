import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JWT_MODULE_OPTIONS } from "@utils/constants";

import { JsonWebTokenService } from "./json-web-token.service";

@Module({
    imports: [JwtModule.register(JWT_MODULE_OPTIONS)],
    providers: [JsonWebTokenService],
    exports: [JsonWebTokenService],
})
export class JsonWebTokenModule {}
