import { ReadEndpointHandlerOptions } from "@interfaces/common";
import { applyDecorators, Get, HttpCode, HttpStatus, SerializeOptions } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam } from "@nestjs/swagger";
import { isDefined } from "class-validator";

export const ApiGetOneById = (opts: ReadEndpointHandlerOptions = {}) => {
    const { path, response } = opts;
    const idName = "id";
    const pathparam = isDefined(path) ? path : `:${idName}`;
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({}),
        ApiOkResponse({ type: response }),
        ApiParam({ name: idName, type: String }),
        SerializeOptions({ excludePrefixes: ["_", "#"] }),
        HttpCode(HttpStatus.OK),
        Get(pathparam)
    );
};
