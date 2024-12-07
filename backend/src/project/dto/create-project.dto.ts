import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    hours: number;

    @IsString({each: true})
    @IsNotEmpty()
    courses: string[];
}
