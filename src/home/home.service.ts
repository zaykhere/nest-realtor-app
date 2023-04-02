import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';

interface getHomesParams {
    city?: string;
    price?: {
        gte?: number,
        lte?: number
    }
    propertyType?: PropertyType 
}

@Injectable()
export class HomeService {
    constructor(private readonly prismaService: PrismaService) {}

    async getHomes(filter: getHomesParams): Promise<HomeResponseDto[]> {
        const homes = await this.prismaService.home.findMany({
            select: {
                id: true,
                address: true,
                price: true,
                property_type: true,
                city: true,
                number_of_bathrooms: true,
                number_of_bedrooms: true,
                images: {
                    select: {
                        url: true
                    },
                    take: 1
                }
                
            },
            where: filter
        });

        if(!homes.length) {
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        }

        return homes.map((home) => new HomeResponseDto(home))
    }
}
