import { UUID } from "node:crypto";

import { UserService } from "@app/user";
import { UserSessionService } from "@app/user-session";
import {
    InvalidSignInCredentialsError,
    UnknownError,
    UserCreatingError,
    UserSessionCreatingError,
} from "@common/errors";
import { HasherService, JsonWebTokenService } from "@common/helpers";
import { User } from "@database/models";
import { SignInDto } from "@dtos/auth";
import { CreateUserDto } from "@dtos/user";
import { Injectable } from "@nestjs/common";
import { AccessTokenResponse } from "@utils/helpers";
import { Response } from "express";
import { isNativeError } from "util/types";

@Injectable()
export class AuthService {
    public constructor(
        private readonly userService: UserService,
        private readonly hasherService: HasherService,
        private readonly userSessionService: UserSessionService,
        private readonly jsonWebTokenService: JsonWebTokenService
    ) {}

    public async signIn(
        res: Response,
        dto: SignInDto
    ): Promise<
        | AccessTokenResponse
        | InvalidSignInCredentialsError
        | UserSessionCreatingError
        | UnknownError
    > {
        const user = await this.getUser(dto);

        if (isNativeError(user)) {
            return user;
        }

        const { id } = user;
        const [accessToken, refreshToken] = await this.signAuthTokens(id);
        const session = await this.userSessionService.create(id, accessToken, refreshToken);

        if (isNativeError(session)) {
            return session;
        }

        this.userSessionService.setRefreshToken(res, refreshToken);

        return new AccessTokenResponse(accessToken);
    }

    public async signUp(dto: CreateUserDto): Promise<void | UserCreatingError | UnknownError> {
        const { password } = dto;
        const hashedPassword = await this.hasherService.hashAsync(password);
        return this.userService.create({ ...dto, password: hashedPassword });
    }

    public async refreshTokens({ id }: User): Promise<AccessTokenResponse | UnknownError> {
        try {
            const accessToken = await this.signAccessTokens(id);
            const session = await this.userSessionService.update(id, accessToken);

            if (isNativeError(session)) {
                return session;
            }

            return new AccessTokenResponse(accessToken);
        } catch (e) {
            return new UnknownError(e);
        }
    }

    public async logout(res: Response, { id }: User): Promise<void | UnknownError> {
        const result = await this.userSessionService.delete(id);

        if (isNativeError(result)) {
            return result;
        }

        this.userSessionService.removeRefreshToken(res);
    }

    private async getUser({
        phone,
        email,
    }: SignInDto): Promise<User | InvalidSignInCredentialsError> {
        if (phone) {
            const user = await this.userService.getOneByPhone(phone);
            return isNativeError(user) ? new InvalidSignInCredentialsError() : user;
        }

        if (email) {
            const user = await this.userService.getOneByEmail(email);
            return isNativeError(user) ? new InvalidSignInCredentialsError() : user;
        }

        return new InvalidSignInCredentialsError();
    }

    private signAuthTokens(userId: UUID): Promise<[string, string]> {
        return Promise.all([this.signAccessTokens(userId), this.signRefreshTokens(userId)]);
    }

    private signAccessTokens(userId: UUID): Promise<string> {
        return this.jsonWebTokenService.signAsync({ sub: userId }, "access");
    }

    private signRefreshTokens(userId: UUID): Promise<string> {
        return this.jsonWebTokenService.signAsync({ sub: userId }, "refresh");
    }
}
