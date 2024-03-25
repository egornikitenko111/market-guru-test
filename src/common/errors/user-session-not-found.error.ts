import { HttpStatus } from "@nestjs/common";
import { ExtendedHttpStatus } from "@utils/enums";

import { BaseApplicationError } from "./base-application.error";

export class UserSessionNotFoundError extends BaseApplicationError {
    public static readonly statusCode = HttpStatus.BAD_REQUEST;
    public static readonly extendedCode = ExtendedHttpStatus.USER_SESSION_NOT_FOUND;
    public static readonly statusMessage = UserSessionNotFoundError.name;
    public static readonly reason = "User session does not exists";

    public constructor() {
        super(UserSessionNotFoundError);
    }
}
