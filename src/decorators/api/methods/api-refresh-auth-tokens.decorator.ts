import { RefreshTokenGuard } from "@common/guards";
import { WriteEndpointHandlerOptions } from "@interfaces/common";
import { applyDecorators, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";

export const ApiRefreshAuthTokens = ({
    response,
}: Pick<WriteEndpointHandlerOptions, "response">) => {
    return applyDecorators(
        ApiBearerAuth(),
        UseGuards(RefreshTokenGuard),
        HttpCode(HttpStatus.OK),
        ApiOkResponse({ type: response }),
        Post("refresh")
    );
};
