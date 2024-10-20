import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString({each: true})
    @IsNotEmpty()
    universities: string[];

    @IsString({each: true})
    @IsNotEmpty()
    courses: string[];

    @IsString({each: true})
    @IsNotEmpty()
    users: string[];
}
