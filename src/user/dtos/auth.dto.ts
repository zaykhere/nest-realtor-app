import { UserType } from "@prisma/client";
import { IsString, IsNotEmpty, IsEmail, MinLength, Matches, IsEnum, IsOptional } from "class-validator";

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

    @IsOptional()
    productKey?: string;
}

export class SigninDto {
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(5)
    password: string;
}

export class GenerateProductKeyDto {
    @IsEmail()
    email: string;

    @IsEnum(UserType)
    userType: UserType

}