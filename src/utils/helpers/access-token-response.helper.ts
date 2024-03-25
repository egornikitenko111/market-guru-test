import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenResponse {
    @ApiProperty({ description: "Contains JWT access token" })
    public readonly accessToken: string;

    public constructor(accessToken: string) {
        this.accessToken = accessToken;
    }
}
