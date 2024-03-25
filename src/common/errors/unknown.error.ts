import { HttpStatus } from "@nestjs/common";
import { ExtendedHttpStatus } from "@utils/enums";
import { isObject } from "class-validator";

import { BaseApplicationError } from "./base-application.error";

export class UnknownError extends BaseApplicationError {
    public static readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    public static readonly extendedCode = ExtendedHttpStatus.UNKNOWN_ERROR;
    public static readonly statusMessage = UnknownError.name;
    public static reason?: string;

    public constructor(cause?: unknown) {
        UnknownError.reason =
            isObject(cause) && "message" in cause ? (cause.message as string) : undefined;
        super(UnknownError);
    }
}
