import { HttpStatus } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional, getSchemaPath } from "@nestjs/swagger";
import { ExtendedHttpStatus } from "@utils/enums";

import { BodyValidationError } from "./body-validation-error.helper";

export class ExceptionResponse {
    @ApiProperty()
    public readonly statusCode: HttpStatus;

    @ApiProperty()
    public readonly extendedCode: ExtendedHttpStatus;

    @ApiProperty()
    public readonly statusMessage: string;

    @ApiPropertyOptional({
        oneOf: [{ type: "string" }, { type: "array", $ref: getSchemaPath(BodyValidationError) }],
    })
    public readonly reason?: string | BodyValidationError[];

    public constructor(props: ExceptionResponse) {
        Object.assign(this, props);
    }
}
