import { UUID } from "node:crypto";

export interface BlockedAuthTokenAttributes {
    readonly id: UUID;
    readonly tokenValue: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
