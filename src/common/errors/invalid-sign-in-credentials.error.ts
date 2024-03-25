import { HttpStatus } from "@nestjs/common";
import { ExtendedHttpStatus } from "@utils/enums";

import { BaseApplicationError } from "./base-application.error";

export class InvalidSignInCredentialsError extends BaseApplicationError {
    public static readonly statusCode = HttpStatus.BAD_REQUEST;
    public static readonly extendedCode = ExtendedHttpStatus.INVALID_SIGN_IN_CREDENTIALS;
    public static readonly statusMessage = InvalidSignInCredentialsError.name;
    public static readonly reason = "Invalid sign in credentials";

    public constructor() {
        super(InvalidSignInCredentialsError);
    }
}
