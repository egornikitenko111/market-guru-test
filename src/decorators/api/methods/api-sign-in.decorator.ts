import { PublicEndpoint } from "@decorators/helpers";
import { WriteEndpointHandlerOptions } from "@interfaces/common";
import { applyDecorators, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

export const ApiSignIn = (opts: Omit<WriteEndpointHandlerOptions, "path">) => {
    const { body, response } = opts;
    return applyDecorators(
        PublicEndpoint(),
        ApiOperation({}),
        HttpCode(HttpStatus.OK),
        ApiBody({ type: body }),
        ApiOkResponse({ type: response }),
        Post("sign-in")
    );
};
