import { randomUUID } from "node:crypto";

import { WriteEndpointHandlerOptions } from "@interfaces/common";
import { applyDecorators, Delete, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam } from "@nestjs/swagger";

export const ApiDelete = (opts: WriteEndpointHandlerOptions = {}) => {
    const { path, response } = opts;
    const idName = "id";
    const pathparam = path || `:${idName}`;
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({}),
        ApiOkResponse({ type: response }),
        ApiParam({ name: idName, type: String, example: randomUUID() }),
        HttpCode(HttpStatus.OK),
        Delete(pathparam)
    );
};
