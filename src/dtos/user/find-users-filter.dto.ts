/**
 * Represents a filter for finding users.
 */
export class FindUsersFilterDto {
    /**
     * An optional array of email addresses.When provided, the search will be narrowed down to
     * users with email addresses matching any in this array.
     */
    public readonly emails?: string[];

    /**
     * An optional array of phone numbers. When specified, the search will focus on users
     * whose phone numbers match any in this array.
     */
    public readonly phones?: string[];

    /**
     * An optional array of first names. This allows filtering users by their first names,
     * matching any name provided in this array.
     */
    public readonly firstNames?: string[];

    /**
     * An optional array of last names. Use this to filter users by their last names,
     * including any name present in this array.
     */
    public readonly lastNames?: string[];

    /**
     * An optional array of middle names. This property enables filtering users by their middle names,
     * considering any name in this array.
     */
    public readonly middleNames?: string[];

    /**
     * An optional number indicating the page number in a paginated request. It is used in conjunction with `limit`
     * to determine the subset of results to return.
     */
    public readonly page?: number;

    /**
     * An optional number that specifies the maximum number of records to return in a single request.
     * It is often used with `page` to implement pagination.
     */
    public readonly limit?: number;

    public constructor(props: FindUsersFilterDto) {
        Object.assign(this, props);
    }
}
