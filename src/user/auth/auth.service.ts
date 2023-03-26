import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import {UserType} from "@prisma/client";

interface SignupParams {
    email: string;
    password: string;
    name: string;
    phone: string;
}

interface SigninParams {
    email: string;
    password: string; 
}

@Injectable()
export class AuthService {

    constructor(private readonly prismaService: PrismaService) {}

    async signup(body: SignupParams) {
        const {email, password,name, phone} = body;

        const userExists = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if(userExists) {
            throw new BadRequestException("This email has already been taken");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await this.prismaService.user.create({
            data: {
                name,
                phone,
                email,
                password: hashedPassword,
                user_type: UserType.BUYER
            }
        });

        const token = await this.generateJWT(name, user.id);

        return {token};
    }

    async signin({email, password}: SigninParams) {
        // Finding user email

        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });

        if(!user) {
            throw new BadRequestException("Invalid Credentials");
        }

        // Comparing password with hashed password

        const hashedPassword = user.password;

        const isValidPassword = await bcrypt.compare(password, hashedPassword);

        if(!isValidPassword) {
            throw new BadRequestException("Invalid Credentials");
        }

        const token = await this.generateJWT(user.name, user.id);

        return {token};
    }

    private async generateJWT(name: string, id: number){
        const token = await jwt.sign({
            name,
            id
        }, process.env.JSON_SECRET_KEY, {
            expiresIn: 3600 * 24 * 30
        })

        return token;
    }
}
