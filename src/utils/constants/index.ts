import { JwtModuleOptions } from "@nestjs/jwt";

/**
 * String to mark endpoint as public (does not require authorization)
 */
export const IS_PUBLIC_ENDPOINT = "IS_PUBLIC";

export const DEFAULT_NODE_ENV = "local";

export const JWT_MODULE_OPTIONS = {
    signOptions: { algorithm: "HS512" },
    verifyOptions: { algorithms: ["HS512"] },
} satisfies JwtModuleOptions;
