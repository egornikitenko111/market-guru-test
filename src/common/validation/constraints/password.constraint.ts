import { minLength, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: "isPasswordString", async: false })
export class PasswordConstraint implements ValidatorConstraintInterface {
    public validate(password: string) {
        const passwordRegex = /^(?=.*[0-9])(?=.*[a-z]).{6,}$/g; // at least 1 digit, at least 1 lower case letter, minimum 6 characters
        return minLength(password, 8) && !!Array.from(password.matchAll(passwordRegex)).length;
    }

    public defaultMessage() {
        return "The password must be at least 6 characters long and contain at least 1 digit, at least 1 lower case letter";
    }
}
