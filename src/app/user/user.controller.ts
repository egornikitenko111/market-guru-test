import { UUID } from "node:crypto";

import { UnknownError, UserNotFoundError } from "@common/errors";
import { UserManagementRequestGuard } from "@common/guards";
import { ParseOptionalArrayPipe, ParseOptionalIntPipe } from "@common/pipes";
import { User } from "@database/models";
import {
    ApiDelete,
    ApiErrorResponse,
    ApiGetAll,
    ApiGetOneById,
    ApiPaginatedResponse,
    ApiUpdate,
    Id,
} from "@decorators/api";
import { FindUsersFilterDto, UpdateUserDto } from "@dtos/user";
import { Body, Controller, Query, UseGuards } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { getArrayPipeOptions } from "@utils/functions";

import { UserService } from "./user.service";

const Emails = () => Query("emails", new ParseOptionalArrayPipe(getArrayPipeOptions(String)));
const Phones = () => Query("phones", new ParseOptionalArrayPipe(getArrayPipeOptions(String)));
const FirstNames = () =>
    Query("firstNames", new ParseOptionalArrayPipe(getArrayPipeOptions(String)));
const LastNames = () => Query("lastNames", new ParseOptionalArrayPipe(getArrayPipeOptions(String)));
const MiddleNames = () =>
    Query("middleNames", new ParseOptionalArrayPipe(getArrayPipeOptions(String)));
const Page = () => Query("page", new ParseOptionalIntPipe(1));
const Limit = () => Query("limit", new ParseOptionalIntPipe(1, 2000));

@ApiTags("User management")
@Controller("user")
export class UserController {
    public constructor(private readonly userService: UserService) {}

    @ApiGetAll()
    @ApiPaginatedResponse(User)
    @ApiErrorResponse(UnknownError)
    @ApiQuery({ name: "emails", type: String, isArray: true, required: false })
    @ApiQuery({ name: "phones", type: String, isArray: true, required: false })
    @ApiQuery({ name: "firstNames", type: String, isArray: true, required: false })
    @ApiQuery({ name: "middleNames", type: String, isArray: true, required: false })
    @ApiQuery({ name: "lastNames", type: String, isArray: true, required: false })
    @ApiQuery({ name: "page", type: Number, required: false })
    @ApiQuery({ name: "limit", type: Number, required: false })
    public async getAll(
        @Emails() emails?: string[],
        @Phones() phones?: string[],
        @FirstNames() firstNames?: string[],
        @LastNames() lastNames?: string[],
        @MiddleNames() middleNames?: string[],
        @Page() page?: number,
        @Limit() limit?: number
    ) {
        return this.userService.getAll(
            new FindUsersFilterDto({
                emails,
                phones,
                firstNames,
                lastNames,
                middleNames,
                page,
                limit,
            })
        );
    }

    @ApiGetOneById({ response: User })
    @ApiErrorResponse(UserNotFoundError, UnknownError)
    public async getOneById(@Id() id: UUID) {
        return this.userService.getOneById(id);
    }

    @ApiUpdate({ body: UpdateUserDto })
    @UseGuards(UserManagementRequestGuard)
    @ApiErrorResponse(UnknownError)
    public async update(@Id() id: UUID, @Body() dto: UpdateUserDto) {
        return this.userService.update(id, dto);
    }

    @ApiDelete()
    @UseGuards(UserManagementRequestGuard)
    @ApiErrorResponse(UnknownError)
    public async delete(@Id() id: UUID) {
        return this.userService.delete(id);
    }
}
