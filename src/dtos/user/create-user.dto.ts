import { PasswordConstraint } from "@common/validation/constraints";
import { UserCreationAttributes } from "@interfaces/models";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsPhoneNumber, IsString, MinLength, Validate, ValidateIf } from "class-validator";

export class CreateUserDto implements UserCreationAttributes {
    @IsString()
    @MinLength(1)
    @ApiProperty()
    public readonly firstName: string;

    @IsString()
    @MinLength(1)
    @ApiProperty()
    public readonly lastName: string;

    @IsString()
    @MinLength(1)
    @ApiProperty()
    public readonly middleName: string;

    @ValidateIf(({ phone, email }) => phone || !email)
    @IsPhoneNumber()
    @ApiPropertyOptional()
    public readonly phone?: string;

    @ValidateIf(({ phone, email }) => email || !phone)
    @IsEmail()
    @ApiPropertyOptional()
    public readonly email?: string;

    @Validate(PasswordConstraint)
    @ApiProperty()
    public readonly password: string;
}
