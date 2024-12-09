import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CryptService } from '../crypt/crypt.service';
import errors from '../../res/consts';
import { UserProjectStatus, Role as UserRole } from "@prisma/client"

const HOUR_IN_TIMESTAMP = 60 * 60 * 1000

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private crypt: CryptService) { }

  async create(createUserDto: CreateUserDto) {
    const encryptedPassword = await this.crypt.encrypt(createUserDto.password);

    // TODO: validar role do usuario e registration (matricula)
    try {
      await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: encryptedPassword,
          registration: createUserDto.registration,
          UserOnCourses: {
            create: createUserDto.courses.map((courseId: string) => ({ courseId }))
          }
        }
      })

      return { message: "created" };
    } catch (error) {
      if (error.code === 'P2002') {
        throw { statusCode: 409, internalCode: 0, message: errors[0] }
      }
      throw { statusCode: 500, error }
    }
  }

  async addCourse(courseId, userId) {
    try {
      const response = await this.prisma.userOnCourses.create({
        data: {
          courseId,
          userId
        }
      });
      return { message: "Course Added" };
    } catch (error) {
      throw { statusCode: 500, message: 'Internal Server Error' }
    }
  }

  async findAll(role?: string) {
    const response = await this.prisma.user.findMany({
      where: {
        ...(role ? {
          role: UserRole[role?.toUpperCase()]
        } : {})
      },
      include: {
        UserOnCourses: {
          include: {
            course: {
              include: {
                university: true
              }
            }
          }
        },
        UsersOnProjects: {
          include: {
            project: {
              include: {
                CoursesOnProjects: {
                  include: {
                    course: {
                      include: {
                        university: true
                      } 
                    }
                  }
                },
              }
            }, 
          }
        }
      }
    });
    return response.map(user => {
      delete user.password
      return user
    });
  }

  async findById(id: string) {
    const response = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        UserOnCourses: {
          include: {
            course: {
              include: {
                university: true
              }
            },
          }
        },
        UsersOnProjects: {
          where: {
            status: UserProjectStatus.ACCEPTED
          },
          include: {
            project: {
              include: {
                CoursesOnProjects: {
                  include: {
                    course: {
                      include: {
                        university: true
                      }
                    }
                  }
                }
              }
            },
          }
        },
        requestedTimeLogs: {
          include: {
            deniedBy: true,
            approvedBy: true,
            project: true
          },
          orderBy: {
            init: 'desc'
          }
        }
      }
    });

    delete response.password

    const hoursRegisterThisMonth = await this.prisma.timeLog.findMany({
      where: {
        projectId: {
          in: response.UsersOnProjects.map(({ project }) => project.id)
        },
        init: {
          gte: new Date(new Date().setDate(1))
        },
        deniedById: null, 
      }
    });

    const totalHours = hoursRegisterThisMonth.reduce((acc, register) => 
      acc + ((register.end.getTime() - register.init.getTime()) / 1)
    , 0) / HOUR_IN_TIMESTAMP
    const percentage = totalHours / 20 * 100

    return { ...response, totalHours, percentage };
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
    // TODO: implement
  }

  async remove(id: string) {
    const response = await this.prisma.user.delete({
      where: { id },
    });

    return { message: "deleted" };
  }

  async userCourses(id: string) {
    const response = await this.prisma.userOnCourses.findMany({
      where: { userId: id },
      include: {
        course: true
      }
    });

    return response;
  }
}
