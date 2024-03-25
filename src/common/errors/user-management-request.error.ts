import { HttpStatus } from "@nestjs/common";
import { ExtendedHttpStatus } from "@utils/enums";

import { BaseApplicationError } from "./base-application.error";

export class UserManagementRequestError extends BaseApplicationError {
    public static readonly statusCode = HttpStatus.FORBIDDEN;
    public static readonly extendedCode = ExtendedHttpStatus.USER_MANAGEMENT_ERROR;
    public static readonly statusMessage = UserManagementRequestError.name;
    public static readonly reason = "Requested endpoint not allowed for authorized user";

    public constructor() {
        super(UserManagementRequestError);
    }
}
