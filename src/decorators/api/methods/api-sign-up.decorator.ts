import { PublicEndpoint } from "@decorators/helpers";
import { WriteEndpointHandlerOptions } from "@interfaces/common";
import { applyDecorators, HttpCode, HttpStatus, Post, SerializeOptions } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";

export const ApiSignUp = (opts: Omit<WriteEndpointHandlerOptions, "path">): MethodDecorator => {
    const { body, response } = opts;
    return applyDecorators(
        PublicEndpoint(),
        ApiOperation({}),
        ApiCreatedResponse({ type: response }),
        SerializeOptions({ excludePrefixes: ["_", "#"] }),
        HttpCode(HttpStatus.CREATED),
        ApiBody({ type: body }),
        Post("sign-up")
    );
};
