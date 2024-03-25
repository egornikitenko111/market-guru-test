import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";
import { groupBy } from "@utils/functions";
import { BodyValidationError, ExceptionResponse } from "@utils/helpers";
import { AnyClass } from "@utils/types";

type ErrorClass = AnyClass & {
    readonly statusCode: HttpStatus;
    readonly statusMessage: string;
    getResponse(): ExceptionResponse;
};

export const ApiErrorResponse = (...errors: ErrorClass[]): PropertyDecorator => {
    if (!errors?.length) {
        return applyDecorators();
    }

    const groupedErrors = groupBy(errors, "statusCode");
    const responseDecorators = Object.values(groupedErrors).map((errors) => {
        const [error] = errors;
        return ApiResponse({
            status: error.statusCode,
            description: errors.map((error) => error.statusMessage).join(" | "),
            schema: {
                $ref: getSchemaPath(ExceptionResponse),
                examples: errors.map((error) => error.getResponse()),
            },
        });
    });

    return applyDecorators(
        ...responseDecorators,
        ApiExtraModels(BodyValidationError, ExceptionResponse)
    );
};
