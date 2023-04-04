import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
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

interface CreateHomeParams {
    address: string;
    number_of_bedrooms: number;
    number_of_bathrooms: number;
    city: string;
    listed_date?: Date;
    price: number;
    land_size: number;
    property_type: PropertyType;
    created_at?: Date;
    updated_at?: Date;
    images: {url: string}[]
}

interface UpdateHomeParams {
    address?: string;
    number_of_bedrooms?: number;
    number_of_bathrooms?: number;
    city?: string;
    listed_date?: Date;
    price?: number;
    land_size?: number;
    property_type?: PropertyType;
    created_at?: Date;
    updated_at?: Date;
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

    async getHomeById(id: number): Promise<HomeResponseDto> {
        const home = await this.prismaService.home.findFirst({
            where: {
                id: id
            },
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
                    }
                }
            }
        });

        if(!home) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);

        return new HomeResponseDto(home);
    }

    async createHome({address, number_of_bathrooms, number_of_bedrooms, city, land_size, property_type, price, images}: CreateHomeParams) {
        const home = await this.prismaService.home.create({
            data: {
                address,
                number_of_bathrooms,
                number_of_bedrooms,
                city,
                land_size,
                property_type,
                realtor_id: 4,
                price
            }
        });

        const homeImages = images.map((image) => {
            return {...image, home_id: home.id}
        });

        await this.prismaService.image.createMany({
            data: homeImages
        });
        console.log(home);
        return home;

    }

    async updateHomeById(id: number, data: UpdateHomeParams) {
        const home = await this.prismaService.home.findUnique({
            where: {
                id: id
            }
        });

        if(!home) {
            throw new NotFoundException();
        }

        const updatedHome = await this.prismaService.home.update({
            where: {
                id: id
            },
            data: data
        });

        return new HomeResponseDto(updatedHome);
    }

    async deleteHomeById(id: number) {
        await this.prismaService.home.delete({
            where: {
                id: id
            }
        })
    }
} 
