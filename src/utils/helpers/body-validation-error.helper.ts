import { ValidationError } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class BodyValidationError {
    @ApiProperty()
    public readonly property: string;

    @ApiProperty()
    public readonly value?: unknown;

    @ApiProperty({ isArray: true })
    public readonly constraints: string[];

    @ApiProperty({ isArray: true, type: BodyValidationError, nullable: true })
    public readonly children?: BodyValidationError[];

    public constructor(error: ValidationError) {
        const { property, value, constraints, children } = error;
        this.property = property;
        this.value = value;
        this.constraints = constraints ? Object.values(constraints) : [];
        this.children = children?.map((child) => new BodyValidationError(child));
    }
}
