import { Injectable } from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UniversityService {
  constructor(private prisma: PrismaService) {}
  
  async create(createUniversityDto: CreateUniversityDto) {
    try {
      const response = await this.prisma.university.create({
        data: createUniversityDto
      })
      return { response, message: "Created" };
    } catch (error) {
      throw {  statusCode: 500, message: 'Erro ao criar Universidade!' }
    }
  }

  async addCourse(universityId: string, courseId: string) {
    try {
      const response = await this.prisma.universitiesOnCourses.create({
        data: {
          universityId,
          courseId
        }
      });
      return { message: "Course Added" };
    } catch (error) {
      throw {  statusCode: 500, message: 'Erro ao adicionar curso!' }
    }
  }

  async findAll() {
    const response = await this.prisma.university.findMany();
    return response;
  }

  async findOne(id: string) {
    const response = await this.prisma.university.findUnique({
      where: { 
        id, 
      },
    });

    if (!response) {
      throw { statusCode: 404 , message: "Not Found"}
    }
    return response;
  }

  async update(id: string, updateUniversityDto: UpdateUniversityDto) {
    try{
      const response = await this.prisma.university.update({
        where: { id },
        data: updateUniversityDto,
      });
      return { response, message: "Updated" };
      } catch (error) {
        throw {  statusCode: 500, message: 'Internal Server Error' }
      }
  }

  async remove(id: string) {
    const response = await this.prisma.university.delete({
      where: { id },
    });
    return { message: "Deleted" };
  }

}
