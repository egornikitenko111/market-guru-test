export type Class<TReturn, TArgs extends ReadonlyArray<any> = any[]> = new (
    ...args: TArgs
) => TReturn;

export type AnyClass = Class<any>;

export type ApiType = AnyClass | [AnyClass] | undefined;

export type Prettify<T extends object> = NonNullable<{ [Key in keyof T]: T[Key] }>;

export type TokenType = "access" | "refresh";

export type MapValuesToKeysIfAllowed<T extends object> = {
    [K in keyof T]: T[K] extends PropertyKey ? K : never;
};

export type ValuesOf<A extends object> = A extends infer O ? O[keyof O] : never;

export type Filter<T extends object> = ValuesOf<MapValuesToKeysIfAllowed<T>>;

export type Func<TArg, TResult = TArg> = (...args: TArg[]) => TResult;

export type Functions<TResult> = Array<Func<TResult>>;
