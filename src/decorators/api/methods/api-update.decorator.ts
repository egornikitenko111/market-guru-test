import { randomUUID } from "node:crypto";

import { WriteEndpointHandlerOptions } from "@interfaces/common";
import { applyDecorators, HttpCode, HttpStatus, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam } from "@nestjs/swagger";
import { isDefined } from "class-validator";

export const ApiUpdate = (opts: WriteEndpointHandlerOptions = {}) => {
    const { path, body, response } = opts;
    const idName = "id";
    const pathparam = isDefined(path) ? path : `:${idName}`;
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({}),
        ApiOkResponse({ type: response }),
        ApiParam({ name: idName, type: String, example: randomUUID() }),
        ApiBody({ type: body }),
        HttpCode(HttpStatus.OK),
        Patch(pathparam)
    );
};
