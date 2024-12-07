import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UniversityService } from 'src/university/university.service';
import  errors  from '../../res/consts';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService, private universityService: UniversityService) {}

  async create(createCourseDto: CreateCourseDto) {
    try {
      await this.prisma.course.createMany({
        data: createCourseDto.universities.map((universityId: string) => {
          return {
            name: createCourseDto.name,
            abreviation: createCourseDto.abreviation,
            internalobs: createCourseDto.internalobs,
            universityId
        }
        }),
      })

      return { message: "created" };
    } catch (error) {
      console.error("error while creating course", error)
      throw {  statusCode: 500, message: 'Internal Server Error' }
    }
  }

  async findAll() {
    const response = await this.prisma.course.findMany({
      include: {
        university: true
      }
    });
    return response;
  }

  async findOne(id: string) {
    const response = await this.prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!response) {
      throw { statusCode: 404 , message: "Not Found"}
    }

    return response;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    // TODO: implementar
  }

  async findById(id: string) {
    const response = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!response) {
      throw { statusCode: 404 , message: "Not Found"}
    }

    return response;
  }

  async remove(id: string) {
    const response = await this.prisma.course.delete({
      where: { id },
    });
    return { message: "Deleted" };
  }
}
