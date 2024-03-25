import { HttpStatus } from "@nestjs/common";
import { ExtendedHttpStatus } from "@utils/enums";

import { BaseApplicationError } from "./base-application.error";

export class TokenMalformedError extends BaseApplicationError {
    public static readonly statusCode = HttpStatus.FORBIDDEN;
    public static readonly extendedCode = ExtendedHttpStatus.TOKEN_MALFORMED;
    public static readonly statusMessage = TokenMalformedError.name;
    public static readonly reason = "Token malformed";

    public constructor() {
        super(TokenMalformedError);
    }
}
