import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { TokenType } from "@utils/types";
import { instanceToPlain } from "class-transformer";
import { JwtPayload } from "jsonwebtoken";

@Injectable()
export class JsonWebTokenService {
    private readonly jwtOptions: Map<TokenType, JwtSignOptions>;

    public constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {
        this.jwtOptions = new Map([
            [
                "access",
                {
                    secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
                    expiresIn: this.configService.getOrThrow<string>("JWT_ACCESS_EXPIRES_IN"),
                },
            ],
            [
                "refresh",
                {
                    secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
                    expiresIn: this.configService.getOrThrow<string>("JWT_REFRESH_EXPIRES_IN"),
                },
            ],
        ]);
    }

    public async signAsync(payload: JwtPayload, tokenType: TokenType): Promise<string> {
        return this.jwtService.signAsync(instanceToPlain(payload), this.jwtOptions.get(tokenType));
    }

    public async verifyAsync(token: string, tokenType: TokenType): Promise<JwtPayload> {
        return this.jwtService.verifyAsync<JwtPayload>(token, this.jwtOptions.get(tokenType));
    }
}
