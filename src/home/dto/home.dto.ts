import { PropertyType } from "@prisma/client";

export class HomeResponseDto {
    id: number;
    address: string;
    number_of_bedrooms: number;
    number_of_bathrooms: number;
    city: string;
    listed_date: Date;
    price: number;
    land_size: number;
    property_type: PropertyType;
    created_at: Date;
    updated_at: Date;
    realtor_id: number;

    constructor(partial: Partial<HomeResponseDto>) {
        Object.assign(this, partial);
    }
}