import { UUID } from "node:crypto";
import { isNativeError } from "node:util/types";

import { UserService } from "@app/user";
import { UserSessionService } from "@app/user-session";
import { TokenExpiredError, TokenMalformedError } from "@common/errors";
import { CookieKey } from "@common/helpers/cookie/types/cookie.keys.enum";
import { User } from "@database/models";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { isUUID } from "@utils/functions";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ExtractJwt, Strategy } from "passport-jwt";

const getJwtTokenFromCookie = (req: Request) => req.cookies[CookieKey.REFRESH_TOKEN];
const getJwtFromRequest = ExtractJwt.fromExtractors([getJwtTokenFromCookie]);

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    public constructor(
        private readonly userService: UserService,
        private readonly userSessionService: UserSessionService,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: getJwtFromRequest,
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
        });
    }

    /**
     * Validates the refresh token.
     *
     * @param req The request object.
     * @param payload The payload of the JWT token.
     * @throws {TokenExpiredError} If the token is expired.
     * @throws {TokenMalformedError} If the token is malformed.
     * @returns Resolved promise if the token is valid.
     */
    public async validate(req: Request, payload: JwtPayload) {
        const expired = this.validateTokenExpired(payload);

        if (isNativeError(expired)) {
            throw expired;
        }

        const user = await this.validateUserExists(payload);

        if (isNativeError(user)) {
            throw user;
        }

        const { id } = user;
        const refreshToken = getJwtFromRequest(req);
        const session = await this.validateUserSession(id, refreshToken);

        if (isNativeError(session)) {
            throw session;
        }

        return user;
    }

    /**
     * Validates the expiration of the access token.
     *
     * @param exp - The expiration time of the token in seconds.
     * @returns False if the token is expired, otherwise a TokenExpiredError or TokenMalformedError.
     */
    private validateTokenExpired({
        exp,
    }: JwtPayload): false | TokenMalformedError | TokenExpiredError {
        if (!exp) {
            return new TokenMalformedError();
        }
        const now = Date.now() / 1000;
        const expired = exp - now > 0;
        return expired ? false : new TokenExpiredError();
    }

    /**
     * Validates the existence of a user based on the JWT payload.
     *
     * @param sub - The subject of the JWT token that stores user ID.
     * @returns A Promise that resolves to the validated user or a TokenMalformedError.
     */
    private async validateUserExists({ sub }: JwtPayload): Promise<TokenMalformedError | User> {
        if (!isUUID<UUID>(sub)) {
            return new TokenMalformedError();
        }
        const user = await this.userService.getOneById(sub);
        return isNativeError(user) ? new TokenMalformedError() : user;
    }

    /**
     * Validates the user session based on the provided user ID and access token.
     *
     * @param userId - The ID of the user.
     * @param refreshToken - The access token.
     * @returns A Promise that resolves to void if the session is valid, or a TokenMalformedError if the session is invalid.
     */
    private async validateUserSession(
        userId: UUID,
        refreshToken: string | null
    ): Promise<void | TokenMalformedError> {
        if (!refreshToken) {
            return new TokenMalformedError();
        }

        const session = await this.userSessionService.getOneByUserId(userId);

        if (isNativeError(session)) {
            return new TokenMalformedError();
        }

        const { refreshToken: storedAccessToken } = session;

        const equals = this.userSessionService.compareTokens(refreshToken, storedAccessToken);

        if (!equals) {
            return new TokenMalformedError();
        }
    }
}
