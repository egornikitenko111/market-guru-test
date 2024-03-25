import { HttpStatus } from "@nestjs/common";
import { ExtendedHttpStatus } from "@utils/enums";

import { BaseApplicationError } from "./base-application.error";

export class UserNotFoundError extends BaseApplicationError {
    public static readonly statusCode = HttpStatus.BAD_REQUEST;
    public static readonly extendedCode = ExtendedHttpStatus.USER_NOT_FOUND;
    public static readonly statusMessage = UserNotFoundError.name;
    public static readonly reason = "User does not exists";

    public constructor() {
        super(UserNotFoundError);
    }
}
