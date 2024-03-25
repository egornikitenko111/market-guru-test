import { RefreshTokenGuard } from "@common/guards";
import { applyDecorators, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

export const ApiLogout = () => {
    return applyDecorators(
        ApiBearerAuth(),
        UseGuards(RefreshTokenGuard),
        HttpCode(HttpStatus.OK),
        Post("logout")
    );
};
