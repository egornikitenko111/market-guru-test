import { Optional } from "sequelize";

import { UserAttributes } from "./model-attributes.interface";

export interface UserCreationAttributes
    extends Omit<Optional<UserAttributes, "id">, "createdAt" | "updatedAt"> {}
