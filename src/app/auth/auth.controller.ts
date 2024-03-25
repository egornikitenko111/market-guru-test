import {
    InvalidSignInCredentialsError,
    UnknownError,
    UserCreatingError,
    UserSessionCreatingError,
} from "@common/errors";
import { User } from "@database/models";
import {
    ApiErrorResponse,
    ApiLogout,
    ApiRefreshAuthTokens,
    ApiSignIn,
    ApiSignUp,
    AuthorizedUser,
} from "@decorators/api";
import { SignInDto } from "@dtos/auth";
import { CreateUserDto } from "@dtos/user";
import { Body, Controller, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AccessTokenResponse } from "@utils/helpers";
import { Response } from "express";

import { AuthService } from "./auth.service";

@ApiTags("Authentication and authorization")
@Controller("auth")
export class AuthController {
    public constructor(private readonly authService: AuthService) {}

    @ApiSignIn({ body: SignInDto, response: AccessTokenResponse })
    @ApiErrorResponse(InvalidSignInCredentialsError, UserSessionCreatingError, UnknownError)
    public async signIn(@Body() dto: SignInDto, @Res() res: Response) {
        const result = await this.authService.signIn(res, dto);
        res.send(result);
    }

    @ApiSignUp({ body: CreateUserDto })
    @ApiErrorResponse(UserCreatingError, UnknownError)
    public async signUp(@Body() dto: CreateUserDto) {
        return this.authService.signUp(dto);
    }

    @ApiRefreshAuthTokens({ response: AccessTokenResponse })
    @ApiErrorResponse(UnknownError)
    public async refreshTokens(@AuthorizedUser() user: User) {
        return this.authService.refreshTokens(user);
    }

    @ApiLogout()
    @ApiErrorResponse(UnknownError)
    public async logout(@AuthorizedUser() user: User, @Res() res: Response) {
        const result = await this.authService.logout(res, user);
        res.send(result);
    }
}
