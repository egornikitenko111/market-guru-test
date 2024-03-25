import { HttpStatus } from "@nestjs/common";
import { ExtendedHttpStatus } from "@utils/enums";
import { BaseError } from "sequelize";

import { BaseApplicationError } from "./base-application.error";

export class UserSessionCreatingError extends BaseApplicationError {
    public static readonly statusCode = HttpStatus.BAD_REQUEST;
    public static readonly extendedCode = ExtendedHttpStatus.USER_SESSION_CREATING_ERROR;
    public static readonly statusMessage = UserSessionCreatingError.name;
    public static reason: string;

    public constructor(cause: BaseError) {
        UserSessionCreatingError.reason = cause.message;
        super(UserSessionCreatingError);
    }
}
