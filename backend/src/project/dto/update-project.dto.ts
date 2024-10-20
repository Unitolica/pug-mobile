import { IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {

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
