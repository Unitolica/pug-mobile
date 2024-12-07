import {  IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateTimeLogDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    init: string;

    @IsString()
    @IsNotEmpty()
    end: string;

    @IsString()
    @IsNotEmpty()
    geolocalization: string;

    @IsString()
    @IsNotEmpty()
    requestedById: string;

    @IsString()
    approvedById: string;

    @IsString()
    deniedById: string;

    @IsString()
    @IsNotEmpty()
    projectId: string;
}

