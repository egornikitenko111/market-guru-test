import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";

import { ClearCookieType, SetCookieType } from "./types";

@Injectable()
export class CookieService {
    public constructor(configService: ConfigService) {
        configService.getOrThrow<string>("BCRYPT_HASH_ROUNDS");
    }

    public setCookies(res: Response, ...cookiesData: SetCookieType[]): void {
        try {
            for (const { key, value, options } of cookiesData) {
                res.cookie(key, value, options);
            }
        } catch (e) {}
    }

    public clearCookies(res: Response, ...cookiesData: ClearCookieType[]): void {
        try {
            for (const { key, options } of cookiesData) {
                res.clearCookie(key, options);
            }
        } catch (e) {}
    }
}
