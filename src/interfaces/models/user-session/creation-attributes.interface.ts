import { Optional } from "sequelize";

import { UserSessionAttributes } from "./model-attributes.interface";

export interface UserSessionCreationAttributes
    extends Omit<Optional<UserSessionAttributes, "id">, "createdAt" | "updatedAt"> {}
