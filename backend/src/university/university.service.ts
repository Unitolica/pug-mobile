import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UniversityService {
  constructor(private prisma: PrismaService) { }

  async create(createUniversityDto: CreateUniversityDto) {
    try {
      const response = await this.prisma.university.create({
        data: {
          id: createUniversityDto.identifier,
          name: createUniversityDto.name,
          description: createUniversityDto.description,
          internalobs: createUniversityDto.internalobs
        }
      })
      return { response, message: "Created" };
    } catch (error) {
      console.error("error while creating university", error)
      throw { statusCode: 500, message: 'Erro ao criar Universidade!' }
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
      throw new NotFoundException()
    }

    return response;
  }

  async update(id: string, updateUniversityDto: UpdateUniversityDto) {
    try {
      const response = await this.prisma.university.update({
        where: { id },
        data: updateUniversityDto,
      });
      return { response, message: "Updated" };
    } catch (error) {
      throw { statusCode: 500, message: 'Internal Server Error' }
    }
  }

  async remove(id: string) {
    const response = await this.prisma.university.delete({
      where: { id },
    });
    return { message: "Deleted" };
  }

}
