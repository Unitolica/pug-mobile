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
      const response = await this.prisma.course.create({
        data: {
          name: createCourseDto.name
        }
      })
      const universityErrors = [];
      createCourseDto.universities.forEach(async (universityId) => {
        try{
          await this.universityService.addCourse(universityId, response.id);
        } catch (error) {
          universityErrors.push(universityId);
        }
      });
      if (universityErrors.length > 0) {
        throw { statusCode: 500, internalCode: 1, message: errors[1], errors: universityErrors }
      }
      return { response, message: "Created" };
    } catch (error) {
      throw {  statusCode: 500, message: 'Internal Server Error' }
    }
  }

  async findAll() {
    const response = await this.prisma.course.findMany();
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
    try{
    const response = await this.prisma.course.update({
      where: { id },
      data: {
        name: updateCourseDto.name
      },
    });
    const universityErrors = [];
    const deleted = await this.prisma.universitiesOnCourses.deleteMany({where: {courseId: id}});
    updateCourseDto.universities.forEach(async (universityId) => {
      try{
        await this.universityService.addCourse(universityId, response.id);
      } catch (error) {
        universityErrors.push(universityId);
      }
    });
    if (universityErrors.length > 0) {
      throw { statusCode: 500, internalCode: 1, message: errors[1], errors: universityErrors }
    }
    return { response, message: "Updated" };
    } catch (error) {
      throw {  statusCode: 500, message: 'Internal Server Error' }
    }
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
