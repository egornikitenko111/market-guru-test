import { UUID } from "node:crypto";

export interface UserSessionAttributes {
    readonly id: UUID;
    readonly userId: UUID;
    readonly accessToken: string;
    readonly refreshToken: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
