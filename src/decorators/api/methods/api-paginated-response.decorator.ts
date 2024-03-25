import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { PaginatedResponse } from "@utils/helpers";

export const ApiPaginatedResponse = <TData extends Type<any>>(dataDto: TData) =>
    applyDecorators(
        ApiExtraModels(PaginatedResponse, dataDto),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(PaginatedResponse) },
                    {
                        properties: {
                            totalPages: { type: "number" },
                            totalRows: { type: "number" },
                            currentPage: { type: "number" },
                            data: { type: "array", items: { $ref: getSchemaPath(dataDto) } },
                        },
                    },
                ],
            },
        })
    );
