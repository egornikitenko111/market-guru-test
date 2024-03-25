import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsPhoneNumber, IsString, ValidateIf } from "class-validator";

export class SignInDto {
    @ValidateIf(({ phone, email }) => phone || !email)
    @IsPhoneNumber()
    @ApiProperty()
    public readonly phone?: string;

    @ValidateIf(({ phone, email }) => email || !phone)
    @IsEmail()
    @ApiProperty()
    public readonly email?: string;

    @IsString()
    @ApiProperty()
    public readonly password: string;
}
