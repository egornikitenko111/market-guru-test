import { HttpStatus, ValidationError } from "@nestjs/common";
import { ExtendedHttpStatus } from "@utils/enums";
import { BodyValidationError } from "@utils/helpers";

import { BaseApplicationError } from "./base-application.error";

export class ReqBodyValidationError extends BaseApplicationError {
    public static readonly statusCode = HttpStatus.BAD_REQUEST;
    public static readonly extendedCode = ExtendedHttpStatus.REQ_BODY_VALIDATION_ERROR;
    public static readonly statusMessage = ReqBodyValidationError.name;
    public static reason: BodyValidationError[];

    public constructor(errors: ValidationError[]) {
        ReqBodyValidationError.reason = Array.isArray(errors)
            ? errors.map((error) => new BodyValidationError(error))
            : errors;
        super(ReqBodyValidationError);
    }
}
