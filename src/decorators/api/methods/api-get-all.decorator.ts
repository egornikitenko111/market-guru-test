import { ReadEndpointHandlerOptions } from "@interfaces/common";
import { applyDecorators, Get, HttpCode, HttpStatus, SerializeOptions } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

export const ApiGetAll = (opts: ReadEndpointHandlerOptions = {}): MethodDecorator => {
    const { path, response } = opts;
    const pathparam = path || "";
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({}),
        ApiOkResponse({ type: response }),
        HttpCode(HttpStatus.OK),
        SerializeOptions({ excludePrefixes: ["_", "#"] }),
        Get(pathparam)
    );
};
