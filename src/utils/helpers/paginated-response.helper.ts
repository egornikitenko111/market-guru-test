import { isObject } from "class-validator";

export class PaginatedResponse<T> {
    public readonly totalPages: number;
    public readonly totalRows: number;
    public readonly currentPage: number;
    public readonly data: T[];

    public constructor(totalPages: number, totalRows: number, currentPage: number, data: T[]) {
        this.totalPages = totalPages;
        this.totalRows = totalRows;
        this.currentPage = currentPage;
        this.data = this.prettifyDataResponse(data);
    }

    private prettifyDataResponse(data: T[]): T[] {
        return data.map((value) =>
            isObject(value) && "toJSON" in value && typeof value.toJSON === "function"
                ? (value.toJSON() as T)
                : value
        );
    }
}
