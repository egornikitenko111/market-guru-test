import { randomInt, randomUUID, UUID } from "node:crypto";

import { PrimaryColumn } from "@decorators/sequelize";
import { UserAttributes, UserCreationAttributes } from "@interfaces/models";
import { ApiProperty } from "@nestjs/swagger";
import { DataTypes } from "sequelize";
import {
    AllowNull,
    Column,
    Default,
    DefaultScope,
    HasMany,
    Index,
    Model,
    Table,
    Unique,
} from "sequelize-typescript";

import { UserSession } from "./user-session.model";

@DefaultScope(() => ({
    attributes: [
        "id",
        "firstName",
        "lastName",
        "middleName",
        "email",
        "phone",
        "createdAt",
        "updatedAt",
    ],
}))
@Table({
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    @Default(DataTypes.UUIDV4)
    @PrimaryColumn(DataTypes.UUID)
    @ApiProperty({ example: randomUUID() })
    public declare readonly id: UUID;

    @AllowNull(false)
    @Index("IX_user_fullname")
    @Column({ type: DataTypes.STRING(70), field: "first_name" })
    @ApiProperty({ example: "John" })
    public readonly firstName: string;

    @AllowNull(false)
    @Index("IX_user_fullname")
    @Column({ type: DataTypes.STRING(70), field: "last_name" })
    @ApiProperty({ example: "Doe" })
    public readonly lastName: string;

    @AllowNull(false)
    @Index("IX_user_fullname")
    @Column({ type: DataTypes.STRING(70), field: "middle_name" })
    @ApiProperty({ example: "Fitzgerald" })
    public readonly middleName: string;

    @Unique(true)
    @AllowNull(true)
    @Index({ name: "IX_user_phone", unique: true })
    @Column(DataTypes.STRING(20))
    @ApiProperty({ example: `+7${randomInt(900_000_0000, 999_000_0000)}` })
    public readonly phone?: string;

    @Unique(true)
    @AllowNull(true)
    @Index({ name: "IX_user_email", unique: true })
    @Column(DataTypes.STRING(255))
    @ApiProperty({ example: "example@mail.com" })
    public readonly email?: string;

    @AllowNull(false)
    @Column(DataTypes.STRING(100))
    public readonly password: string;

    @AllowNull(false)
    @Default(DataTypes.NOW)
    @Column({ type: DataTypes.DATE, field: "created_at" })
    @ApiProperty({ example: new Date().toISOString() })
    public declare readonly createdAt: Date;

    @AllowNull(false)
    @Default(DataTypes.NOW)
    @Column({ type: DataTypes.DATE, field: "updated_at" })
    @ApiProperty({ example: new Date().toISOString() })
    public declare readonly updatedAt: Date;

    @HasMany(() => UserSession)
    public readonly userSessions: UserSession[];
}
