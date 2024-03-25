import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { isEmpty } from "class-validator";

/** Convert a string like "1" to a number, but without NaN */
export class ParseOptionalIntPipe implements PipeTransform<string> {
    public constructor(
        private readonly min = -Infinity,
        private readonly max = Infinity
    ) {}

    public transform(value: string, metadata: ArgumentMetadata): number | undefined {
        const num = parseInt(value, 10);

        if (isEmpty(value) || isNaN(num)) {
            return undefined;
        }

        if (!(num >= this.min && num <= this.max)) {
            throw new BadRequestException(
                `${metadata.data} should be ≥ ${this.min} and ≤ ${this.max}`
            );
        }

        return num;
    }
}
