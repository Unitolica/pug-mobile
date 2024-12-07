import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import  errors  from '../../res/consts';
import { Role } from 'src/auth/res/roles.enum';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      await this.prisma.project.create({
        data: {
          name: createProjectDto.name,
          description: createProjectDto.description,
          hours: createProjectDto.hours,
          CoursesOnProjects: {
            create: createProjectDto.courses.map((courseId: string) => ({ courseId }))
          }
        }
      })
      return { message: "created" };
    } catch (error) {
      if (error.code === 'P2002'){
        throw {  statusCode: 409, internalCode: 0, message: errors[0] }
      }
      
      throw {  statusCode: 500, message: 'Erro ao Cadastrar Projeto!'}
    }
  }

  async findAssigned(user: any) {
    const usersOnProjects = await this.prisma.usersOnProjects.findMany({
      where: {
        userId: user.id
      },
      select: {
        project: true
      }
    });

    return usersOnProjects;
  }

  async findUserProjects(user: any) {
    // TODO: implementar
  }

  async findAll(course?: string) {
    return this.prisma.project.findMany({
      where: {
        ...(course ? {
          CoursesOnProjects: {
            some: {
              courseId: course
            }
          }
        } : {})
      }
    });
  }

  async findOne(id: string, user: any) {
    if (user.role != Role.ADMIN && !user.projects.some((project) => project.id == response.id)) {
      throw new UnauthorizedException();
    }

    const response = await this.prisma.project.findUnique({
      where: { 
        id, 
      },
    });

    if (!response) {
      throw { statusCode: 404 , message: "Not Found"}
    }

    if (user.role == Role.STUDENT) {
      const users = await this.prisma.usersOnProjects.findMany({
        where: {
          projectId: id
        },
        select: {
          user: true
        }
      });

      for (user in users) {
        const actualUser = await this.prisma.user.findUnique({
          where: {
            id: user.id
          }
        });

        if (actualUser.id) {
          if (!response[actualUser.role]) {
            response[actualUser.role] = [];
          }

          response[actualUser.role].push(actualUser.id);
        }
      }
    }

    return response;
  }

  async updateMine(id: string, updateProjectDto: UpdateProjectDto, user: any) {
    if (user.role == Role.STUDENT && user.id != id) {
      throw new UnauthorizedException();
    }

    return this.update(id, updateProjectDto);
  }


  async update(id: string, updateProjectDto: UpdateProjectDto) {
    // TODO: implementar
  }

  async remove(id: string) {
    await this.prisma.project.delete({
      where: { id },
    });

    return { message: "deleted" };
  }
}
