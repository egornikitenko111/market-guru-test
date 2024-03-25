import { UUID } from "node:crypto";
import { isNativeError } from "node:util/types";

import { UserService } from "@app/user";
import { UserSessionService } from "@app/user-session";
import { TokenExpiredError, TokenMalformedError } from "@common/errors";
import { User } from "@database/models";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { isUUID } from "@utils/functions";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ExtractJwt, Strategy } from "passport-jwt";

const getJwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    public constructor(
        private readonly userService: UserService,
        private readonly userSessionService: UserSessionService,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: getJwtFromRequest,
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
        });
    }

    /**
     * Validates the access token and returns the corresponding user.
     *
     * @param req The request object.
     * @param payload The payload of the JWT token.
     * @returns A Promise that resolves to the validated user.
     * @throws {TokenExpiredError} If the token has expired.
     * @throws {TokenMalformedError} If the token is malformed or invalid.
     */
    public async validate(req: Request, payload: JwtPayload): Promise<User> {
        const expired = this.validateTokenExpired(payload);

        if (isNativeError(expired)) {
            throw expired;
        }

        const user = await this.validateUserExists(payload);

        if (isNativeError(user)) {
            throw user;
        }

        const { id } = user;
        const accessToken = getJwtFromRequest(req);
        const session = await this.validateUserSession(id, accessToken);

        if (isNativeError(session)) {
            throw session;
        }

        return user;
    }

    /**
     * Validates the expiration of the access token.
     *
     * @param exp The expiration time of the token in seconds.
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
     * @param sub The subject of the JWT token that stores user ID.
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
     * @param userId The ID of the user.
     * @param accessToken The access token.
     * @returns A Promise that resolves to void if the session is valid, or a TokenMalformedError if the session is invalid.
     */
    private async validateUserSession(
        userId: UUID,
        accessToken: string | null
    ): Promise<void | TokenMalformedError> {
        if (!accessToken) {
            return new TokenMalformedError();
        }

        const session = await this.userSessionService.getOneByUserId(userId);

        if (isNativeError(session)) {
            return new TokenMalformedError();
        }

        const { accessToken: storedAccessToken } = session;
        const equals = this.userSessionService.compareTokens(accessToken, storedAccessToken);

        if (!equals) {
            return new TokenMalformedError();
        }
    }
}
