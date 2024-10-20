import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CryptService } from '../crypt/crypt.service';
import  errors  from '../../res/consts';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private crypt: CryptService) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await this.crypt.encrypt(createUserDto.password);
    try {
      const response = await this.prisma.user.create({
        data: this.saveUserDto(createUserDto) 
      })
      const universityErrors = [];
      createUserDto.universities.forEach(async (universityId) => {
        try{
          await this.addUniversity(universityId, response.id);
        } catch (error) {
          universityErrors.push(universityId);
        }
      });
      if (universityErrors.length > 0) {
        throw { statusCode: 500, internalCode: 2, message: errors[2], errors: universityErrors }
      }
      return { response, message: "Created" };
    } catch (error) {
      if (error.code === 'P2002'){
        throw {  statusCode: 409, internalCode: 0, message: errors[0] }
      }
      throw {  statusCode: 500, message: 'Internal Server Error' }
    }
  }

  saveUserDto(createUserDto: CreateUserDto){
    const { universities, courses, ...user } = createUserDto;
    return user;
  }

  async addUniversity(universityId, userId){
    try {
      const response = await this.prisma.userOnUniversities.create({
        data: {
          universityId,
          userId
        }
      });
      return { message: "University Added" };
    } catch (error) {
      throw {  statusCode: 500, message: 'Internal Server Error' }
    }
  }

  async addCourse(courseId, userId){
    try {
      const response = await this.prisma.userOnCourses.create({
        data: {
          courseId,
          userId
        }
      });
      return { message: "University Added" };
    } catch (error) {
      throw {  statusCode: 500, message: 'Internal Server Error' }
    }
  }

  async findAll() {
    const response = await this.prisma.user.findMany();
    return response;
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

  async findByEmail(email: string) {
    const response = await this.prisma.user.findUnique({
      where: { 
        email, 
      },
    });

    return response;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password){
    updateUserDto.password = await this.crypt.encrypt(updateUserDto.password);
    }
    try{
    const response = this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    const universityErrors = [];
    this.prisma.userOnUniversities.deleteMany({ where: { userId: id } });
    updateUserDto.universities.forEach(async (universityId) => {
      try{
        await this.addUniversity(universityId, id);
      } catch (error) {
        universityErrors.push(universityId);
      }
    });
    if (universityErrors.length > 0) {
      throw { statusCode: 500, internalCode: 2, message: errors[2], errors: universityErrors }
    }
    const coursesErrors = [];
    this.prisma.userOnCourses.deleteMany({ where: { userId: id } });
    updateUserDto.courses.forEach(async (courseId) => {
      try{
        await this.addCourse(courseId, id);
      } catch (error) {
        coursesErrors.push(courseId);
      }
    });
    if (coursesErrors.length > 0) {
      throw { statusCode: 500, internalCode: 1, message: errors[1], errors: coursesErrors }
    }
    return { response, message: "Updated" };
    } catch (error) {
      if (error.code === 'P2002'){
        throw {  statusCode: 409, internalCode: 0, message: errors[0] }
      }
      throw {  statusCode: 500, message: 'Internal Server Error' }
    }
  }

  async remove(id: string) {
    const response = await this.prisma.user.delete({
      where: { id },
    });
    return { message: "Deleted" };
  }
}
