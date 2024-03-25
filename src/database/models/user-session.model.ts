import { UUID } from "node:crypto";

import { PrimaryColumn } from "@decorators/sequelize";
import { UserSessionAttributes, UserSessionCreationAttributes } from "@interfaces/models";
import { DataTypes } from "sequelize";
import {
    AllowNull,
    BelongsTo,
    Column,
    Default,
    ForeignKey,
    Index,
    Model,
    Table,
    Unique,
} from "sequelize-typescript";

import { User } from "./user.model";

@Table({
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})
export class UserSession
    extends Model<UserSessionAttributes, UserSessionCreationAttributes>
    implements UserSessionAttributes
{
    @Default(DataTypes.UUIDV4)
    @PrimaryColumn(DataTypes.UUID)
    public declare readonly id: UUID;

    @AllowNull(false)
    @Unique(true)
    @Index("IX_user_session")
    @ForeignKey(() => User)
    @Column({ type: DataTypes.UUID, onDelete: "CASCADE", field: "user_id" })
    public declare readonly userId: UUID;

    @AllowNull(false)
    @Column({ type: DataTypes.STRING(300), field: "access_token" })
    public declare readonly accessToken: string;

    @AllowNull(false)
    @Column({ type: DataTypes.STRING(300), field: "refresh_token" })
    public declare readonly refreshToken: string;

    @AllowNull(false)
    @Default(DataTypes.NOW)
    @Column({ type: DataTypes.DATE, field: "created_at" })
    public declare readonly createdAt: Date;

    @AllowNull(false)
    @Default(DataTypes.NOW)
    @Column({ type: DataTypes.DATE, field: "updated_at" })
    public declare readonly updatedAt: Date;

    @BelongsTo(() => User)
    public readonly user: User;
}
