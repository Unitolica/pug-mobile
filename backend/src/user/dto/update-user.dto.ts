import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString({each: true})
    @IsNotEmpty()
    universities: string[];

    @IsString({each: true})
    @IsNotEmpty()
    courses: string[];

}
