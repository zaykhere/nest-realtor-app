import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcryptjs";
import {UserType} from "@prisma/client";

interface SignupParams {
    email: string;
    password: string;
    name: string;
    phone: string;
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
            throw new BadRequestException()
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await this.prismaService.user.create({
            data: {
                name,
                phone,
                email,
                password,
                user_type: UserType.BUYER
            }
        });

        return user;
    }
}
