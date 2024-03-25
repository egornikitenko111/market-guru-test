import { CookieOptions } from "express";

import { CookieKey } from "./cookie.keys.enum";

export type SetCookieType = {
    key: CookieKey;
    value: string;
    options: CookieOptions;
};
