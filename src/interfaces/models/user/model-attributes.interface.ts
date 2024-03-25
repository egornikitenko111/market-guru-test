import { UUID } from "node:crypto";

export interface UserAttributes {
    readonly id: UUID;
    readonly firstName: string;
    readonly lastName: string;
    readonly middleName: string;
    readonly phone?: string;
    readonly email?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
