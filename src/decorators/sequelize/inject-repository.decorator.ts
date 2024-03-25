import { Inject } from "@nestjs/common";
import { createRepositoryToken } from "@utils/functions";
import { Model } from "sequelize-typescript";

export const InjectRepository = <TModel extends typeof Model<any, any>>(model: TModel) =>
    Inject(createRepositoryToken(model));
