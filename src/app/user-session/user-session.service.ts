import { createHash, UUID } from "node:crypto";

import { UnknownError, UserSessionCreatingError, UserSessionNotFoundError } from "@common/errors";
import { CookieService } from "@common/helpers";
import { CookieKey } from "@common/helpers/cookie/types/cookie.keys.enum";
import { UserSession } from "@database/models/user-session.model";
import { InjectRepository } from "@decorators/sequelize";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CookieOptions, Response } from "express";
import ms from "ms";
import { BaseError } from "sequelize";
import { Repository } from "sequelize-typescript";

@Injectable()
export class UserSessionService {
    private readonly refreshTokenExpiresIn: number;

    public constructor(
        @InjectRepository(UserSession)
        private readonly userSessionRepository: Repository<UserSession>,
        private readonly cookieService: CookieService,
        private readonly configService: ConfigService
    ) {
        this.refreshTokenExpiresIn = ms(
            this.configService.getOrThrow<string>("JWT_REFRESH_EXPIRES_IN")
        );
    }

    public async create(
        userId: UUID,
        accessToken: string,
        refreshToken: string
    ): Promise<void | UserSessionCreatingError | UnknownError> {
        try {
            const session = {
                userId: userId,
                accessToken: this.hashToken(accessToken),
                refreshToken: this.hashToken(refreshToken),
            };
            await this.userSessionRepository.upsert(session);
        } catch (e) {
            if (e instanceof BaseError) {
                return new UserSessionCreatingError(e);
            }
            return new UnknownError(e);
        }
    }

    public async getOneByUserId(
        userId: UUID
    ): Promise<UserSession | UnknownError | UserSessionNotFoundError> {
        try {
            const session = await this.userSessionRepository.findOne({ where: { userId } });
            if (!session) {
                return new UserSessionNotFoundError();
            }
            return session;
        } catch (e) {
            return new UnknownError(e);
        }
    }

    public async update(userId: UUID, accessToken?: string): Promise<void | UnknownError> {
        try {
            const session = {
                accessToken: accessToken && this.hashToken(accessToken),
                updatedAt: new Date(),
            };
            await this.userSessionRepository.update(session, { where: { userId } });
        } catch (e) {
            return new UnknownError(e);
        }
    }

    public async delete(userId: UUID): Promise<void | UnknownError> {
        try {
            await this.userSessionRepository.destroy({ where: { userId } });
        } catch (e) {
            return new UnknownError(e);
        }
    }

    /**
     * Sets the refresh token in the response cookie.
     *
     * @param res - The response object.
     * @param refreshToken - The refresh token to be set.
     */
    public setRefreshToken(res: Response, refreshToken: string): void {
        this.cookieService.setCookies(res, {
            key: CookieKey.REFRESH_TOKEN,
            value: refreshToken,
            options: this.getCookieOptions(),
        });
    }

    public removeRefreshToken(res: Response): void {
        this.cookieService.clearCookies(res, { key: CookieKey.REFRESH_TOKEN });
    }

    /**
     * Compares two tokens and returns a boolean indicating whether they are equal.
     *
     * @param inputToken - The unhashed token to be compared.
     * @param storedToken - The hashed token to compare against.
     * @returns A boolean indicating whether the tokens are equal.
     */
    public compareTokens(inputToken: string, storedToken: string): boolean {
        const hashedToken = this.hashToken(inputToken);
        return hashedToken === storedToken;
    }

    private hashToken(token: string): string {
        return createHash("sha512").update(token).digest("hex");
    }

    private getCookieOptions(): CookieOptions {
        return {
            maxAge: this.refreshTokenExpiresIn,
            path: "/",
            httpOnly: true,
        };
    }
}
