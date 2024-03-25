import * as path from "node:path";

import { ReqBodyValidationError } from "@common/errors";
import { HttpException, Type } from "@nestjs/common";
import { DEFAULT_NODE_ENV } from "@utils/constants";
import { Filter, Functions } from "@utils/types";
import { isUUID as isUUIDBase, ValidationError } from "class-validator";
import { Model } from "sequelize-typescript";

export const getArrayPipeOptions = (items: Type<unknown>) => ({
    expectedType: items,
    items: items,
    exceptionFactory: (errors: ValidationError[]) => new ReqBodyValidationError(errors),
});

export const getEnvPath = () =>
    path.join(process.cwd(), "src", "env", `.${process.env.NODE_ENV || DEFAULT_NODE_ENV}.env`);

export const createRepositoryToken = <TModel extends typeof Model<any, any>>(model: TModel) =>
    `${model.name.toUpperCase()}_REPOSITORY`;

export const isHttpException = (value: unknown): value is HttpException =>
    value instanceof HttpException;

export const isUUID = <T extends string>(value: unknown): value is T => isUUIDBase(value);

export const groupBy = <T extends Record<PropertyKey, any>, Key extends Filter<T>>(
    objects: T[],
    key: Key
): Record<T[Key], T[]> => {
    return objects.reduce(
        (accumulator, value) => {
            const groupedKey = value[key];
            if (!accumulator[groupedKey]) {
                accumulator[groupedKey] = [];
            }
            accumulator[groupedKey].push(value);
            return accumulator;
        },
        {} as Record<T[Key], T[]>
    );
};

export const pipe = <TArgs extends any[], TResult>(
    fn1: (...args: TArgs) => TResult,
    ...fns: Functions<TResult>
) => {
    const piped = fns.reduce(
        (prevFn, nextFn) => (value: TResult) => nextFn(prevFn(value)),
        (value) => value
    );
    return (...args: TArgs) => piped(fn1(...args));
};
