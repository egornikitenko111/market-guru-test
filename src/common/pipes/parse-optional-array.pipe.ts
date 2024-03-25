import { ArgumentMetadata, Optional, ParseArrayOptions, ParseArrayPipe } from "@nestjs/common";
import { isEmpty } from "class-validator";

type Item = ParseArrayOptions["items"];

export class ParseOptionalArrayPipe extends ParseArrayPipe {
    public constructor(
        @Optional() protected readonly options: ParseArrayOptions = {},
        private readonly uniqueFields: string[] = []
    ) {
        super(options);
    }

    public async transform(values: Item[], metadata: ArgumentMetadata): Promise<any> {
        if (isEmpty(values)) {
            return undefined;
        }
        return super.transform(values, metadata);
    }
}
