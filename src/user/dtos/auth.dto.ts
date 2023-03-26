import { IsString, IsNotEmpty, IsEmail, MinLength, Matches } from "class-validator";

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @Matches(/^\d{11}$/, {message: "phone must be a valid phone number"})
    phone: string;

    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(5)
    password: string;
}