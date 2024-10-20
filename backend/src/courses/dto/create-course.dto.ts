import {  IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString({each: true})
    @IsNotEmpty()
    universities: string[];
}
