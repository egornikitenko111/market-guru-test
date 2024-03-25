import { Optional } from "sequelize";

import { BlockedAuthTokenAttributes } from "./model-attributes.interface";

export interface BlockedAuthTokenCreationAttributes
    extends Omit<Optional<BlockedAuthTokenAttributes, "id">, "createdAt" | "updatedAt"> {}
