import { UUID } from "node:crypto";

import { UserManagementRequestError } from "@common/errors";
import { User } from "@database/models";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class UserManagementRequestGuard implements CanActivate {
    public canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();
        const requestedUserId = req.params.id as UUID;
        const authorizedUser = req.user as User;

        if (requestedUserId !== authorizedUser.id) {
            throw new UserManagementRequestError();
        }

        return true;
    }
}
