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
      const response = await this.prisma.project.create({
        data: this.saveProjectDto(createProjectDto)
      })
      
      const universityErrors = [];
      createProjectDto.universities.forEach(async (universityId) => {
        try{
          await this.addUniversity(universityId, response.id);
        } catch (error) {
          universityErrors.push(universityId);
        }
      });
      if (universityErrors.length > 0) {
        throw { statusCode: 500, internalCode: 2, message: errors[2], errors: universityErrors }
      }

      const coursesErrors = [];
      createProjectDto.courses.forEach(async (courseId) => {
      try{
        const validCourse = await this.prisma.universitiesOnCourses.findFirst({
          where: { 
            courseId: courseId,
            universityId: { 
              in: createProjectDto.universities
            }
          }
        });
        if (!validCourse) {
          throw { statusCode: 400, internalCode: 1, message: errors[1], courseId }
        }
        await this.addCourse(courseId, response.id);
      } catch (error) {
        coursesErrors.push({error, courseId});
      }
    });
    if (coursesErrors.length > 0) {
      throw { statusCode: 500, internalCode: 1, message: errors[1], errors: coursesErrors }
    }

    const usersErrors = [];
      createProjectDto.users.forEach(async (userId) => {
      try{
        const validUser = await this.prisma.userOnCourses.findFirst({
          where: { 
            userId,
            courseId: { 
              in: createProjectDto.courses
            }
          }
        });
        if (!validUser) {
          throw { statusCode: 400, internalCode: 3, message: errors[3], userId }
        }
        await this.addUser(userId, response.id);
      } catch (error) {
        usersErrors.push({error, userId});
      }
    });
    if (usersErrors.length > 0) {
      throw { statusCode: 500, internalCode: 3, message: errors[3], errors: usersErrors }
    }

      return { response, message: "Created" };
    } catch (error) {
      if (error.code === 'P2002'){
        throw {  statusCode: 409, internalCode: 0, message: errors[0] }
      }
      
      throw {  statusCode: 500, message: 'Erro ao Cadastrar Projeto!'}
    }
  }

  saveProjectDto(createProjectDto: CreateProjectDto){
    const { universities, courses, users, ...project } = createProjectDto;
    return project;
  }

  async addUser(userId, projectId){
    try {
      const response = await this.prisma.usersOnProjects.create({
        data: {
          userId,
          projectId
        }
      });
      return { message: "User Added" };
    } catch (error) {
      throw {  statusCode: 500, message: 'Internal Server Error' }
    }
  }

  async addUniversity(universityId, projectId){
    try {
      const response = await this.prisma.universitiesOnProjects.create({
        data: {
          universityId,
          projectId
        }
      });
      return { message: "University Added" };
    } catch (error) {
      throw {  statusCode: 500, message: 'Internal Server Error' }
    }
  }

  async addCourse(courseId, projectId){
    try {
      const response = await this.prisma.coursesOnProjects.create({
        data: {
          courseId,
          projectId
        }
      });
      return { message: "Course Added" };
    } catch (error) {
      throw {  statusCode: 500, message: 'Internal Server Error' }
    }
  }

  async findAll() {
    const projects = await this.prisma.project.findMany();
    return projects;
  }

  async findOne(id: string) {
    const response = await this.prisma.project.findUnique({
      where: { 
        id, 
      },
    });

    if (!response) {
      throw { statusCode: 404 , message: "Not Found"}
    }

    return response;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, user: any) {
    if (user.role == Role.STUDENT && user.id != id) {
      throw new UnauthorizedException();
    }

    try {
      const response = await this.prisma.project.update({
        where: { id },
        data: this.updateProjectDto(updateProjectDto),
      });
      const universityErrors = [];
      await this.prisma.universitiesOnProjects.deleteMany({ where: { projectId: id } });
      updateProjectDto.universities.forEach(async (universityId) => {
        try {
          await this.addUniversity(universityId, id);
        } catch (error) {
          universityErrors.push(universityId);
        }
      });
      if (universityErrors.length > 0) {
        throw { statusCode: 500, internalCode: 2, message: errors[2], errors: universityErrors }
      }
      const coursesErrors = [];
      await this.prisma.coursesOnProjects.deleteMany({ where: { projectId: id } });
      updateProjectDto.courses.forEach(async (courseId) => {
        try {
          const validCourse = await this.prisma.universitiesOnCourses.findFirst({
            where: {
              courseId: courseId,
              universityId: {
                in: updateProjectDto.universities
              }
            }
          });
          if (!validCourse) {
            throw { statusCode: 400, internalCode: 1, message: errors[1], courseId }
          }
          await this.addCourse(courseId, id);
        } catch (error) {
          coursesErrors.push({ error, courseId });
        }
      });
      if (coursesErrors.length > 0) {
        throw { statusCode: 500, internalCode: 1, message: errors[1], errors: coursesErrors }
      }
      return { response, message: "Updated" };
    } catch (error) {
      if (error.code === 'P2002') {
        throw { statusCode: 409, internalCode: 0, message: errors[0] }
      }
      throw { statusCode: 500, message: 'Internal Server Error' }
    }
  }

  updateProjectDto(updateProjectDto: UpdateProjectDto){
    const { universities, courses, users, ...project } = updateProjectDto;
    return project;
  }

  async remove(id: string) {
    const response = await this.prisma.project.delete({
      where: { id },
    });
    return { message: "Deleted" };
  }
}
