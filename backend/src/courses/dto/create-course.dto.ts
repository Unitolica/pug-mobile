import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  abreviation: string;

  @IsString()
  @IsOptional()
  internalobs: string;

  @IsString({ each: true })
  @IsNotEmpty()
  universities: string[];
}
