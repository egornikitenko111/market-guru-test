import { HttpException, HttpStatus } from "@nestjs/common";
import { ExtendedHttpStatus } from "@utils/enums";
import { BodyValidationError, ExceptionResponse } from "@utils/helpers";

type ExceptionConstructor = { getResponse: () => any; statusCode: HttpStatus };

export abstract class BaseApplicationError extends HttpException {
    public static readonly statusCode: HttpStatus;
    public static readonly extendedCode: ExtendedHttpStatus;
    public static readonly statusMessage: string;
    public static reason?: string | BodyValidationError[];

    public static getResponse(): ExceptionResponse {
        return new ExceptionResponse({
            statusCode: this.statusCode,
            extendedCode: this.extendedCode,
            statusMessage: this.statusMessage,
            reason: this.reason,
        });
    }

    public constructor(obj: ExceptionConstructor) {
        super(obj.getResponse(), obj.statusCode);
    }
}
