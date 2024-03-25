import { HttpStatus } from "@nestjs/common";
import { ExtendedHttpStatus } from "@utils/enums";
import { BaseError } from "sequelize";

import { BaseApplicationError } from "./base-application.error";

export class UserCreatingError extends BaseApplicationError {
    public static readonly statusCode = HttpStatus.BAD_REQUEST;
    public static readonly extendedCode = ExtendedHttpStatus.USER_CREATING_ERROR;
    public static readonly statusMessage = UserCreatingError.name;
    public static reason: string;

    public constructor(cause: BaseError) {
        UserCreatingError.reason = cause.message;
        super(UserCreatingError);
    }
}
