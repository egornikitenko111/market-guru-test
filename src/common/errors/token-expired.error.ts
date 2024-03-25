import { HttpStatus } from "@nestjs/common";
import { ExtendedHttpStatus } from "@utils/enums";

import { BaseApplicationError } from "./base-application.error";

export class TokenExpiredError extends BaseApplicationError {
    public static readonly statusCode = HttpStatus.FORBIDDEN;
    public static readonly extendedCode = ExtendedHttpStatus.TOKEN_EXPIRED;
    public static readonly statusMessage = TokenExpiredError.name;
    public static readonly reason = "Token expired";

    public constructor() {
        super(TokenExpiredError);
    }
}
