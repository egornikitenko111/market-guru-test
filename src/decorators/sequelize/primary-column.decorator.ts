import { applyDecorators } from "@nestjs/common";
import { DataType } from "sequelize";
import { Column, PrimaryKey } from "sequelize-typescript";

export const PrimaryColumn = (dataType: DataType): PropertyDecorator =>
    applyDecorators(Column(dataType) as PropertyDecorator, PrimaryKey as PropertyDecorator);
