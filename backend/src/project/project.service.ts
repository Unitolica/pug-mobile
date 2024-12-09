import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import  errors  from '../../res/consts';
import { Role } from 'src/auth/res/roles.enum';
import { User, UserProjectStatus } from '@prisma/client';

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

  async getRequestLinkStatus(projectId: string, user: any) {
    const response = await this.prisma.usersOnProjects.findFirst({
      where: {
        userId: user.id,
        projectId: projectId,
      }
    });

    if (!response) {
      return { status: null }
    }

    return { status: response.status };
  }

  async requestLink(projectId: string, user: any) {
    try {
      await this.prisma.usersOnProjects.upsert({
        where: {
          userId_projectId: {
            projectId: projectId,
            userId: user.id as string
          },
          status: {
            notIn: [UserProjectStatus.ACCEPTED, UserProjectStatus.REJECTED]
          }
        },
        update: {
          status: UserProjectStatus.REQUESTED
        },
        create: {
          userId: user.id,
          projectId: projectId,
          status: UserProjectStatus.REQUESTED
        }
      })

      return { message: "ok" }
    } catch (error) {
      throw { statusCode: 500, message: 'Internal Server Error' }
    }
  }

  async respondLinkRequest({ userId, projectId, response }: { projectId: string, userId: string, response: "ACCEPTED" | "REJECTED" }) {
    try {
      await this.prisma.usersOnProjects.update({
        where: {
          userId_projectId: {
            projectId,
            userId,
          }
        },
        data: {
          status: UserProjectStatus[response]
        }
      })

      return { message: "ok" }
    } catch (error) {
      console.error("error while responding link request", error)
      throw { statusCode: 500, message: 'Internal Server Error' }
    }
  }

  async findLinkRequests() {
    const response = await this.prisma.usersOnProjects.findMany({
      where: {
        status: UserProjectStatus.REQUESTED
      },
      select: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            hours: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            registration: true,
            UserOnCourses: {
              select: {
                course: {
                  select: {
                    name: true,
                    abreviation: true,
                    university: {
                      select: {
                        name: true,
                        description: true,
                      }
                    }
                  },
                }
              },
            },
          }
        },
      }
    });

    return response;
  }

  async registerActivity({ init, end, projectId, description }: { init: any, end: any, projectId: string, description: string }, user: any) {
    try {
      await this.prisma.timeLog.create({
        data: {
          init: new Date(init.timestamp),
          end: new Date(end.timestamp),
          requestedById: user.id,
          approvedById: null,
          description,
          projectId,
          geolocalization: JSON.stringify({
            init: {
              latitude: init.location.latitude,
              longitude: init.location.longitude
            },
            end: {
              latitude: end.location.latitude,
              longitude: end.location.longitude
            }
          }),
        }
      })

    } catch (error) {
      console.error("error while registering activity", error)
      throw { statusCode: 500, message: 'Internal Server Error' }
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

  async findAll({ user, course, q }: { course?: string, q?: string, user: User }) {
    return this.prisma.project.findMany({
      where: {
        AND: [
          course ? {
            CoursesOnProjects: {
              some: {
                courseId: course
              }
            }
          } : {},

          user.role === Role.STUDENT ? {
            CoursesOnProjects: {
              some: {
                course: {
                  UserOnCourses: {
                    some: {
                      userId: user.id
                    }
                  },
                }
              }
            }
          } : {},

          q ? {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } }
            ]
          } : {}
        ]
      }
    });
  }

  async findOne(id: string, user: any) {
    return this.prisma.project.findUnique({
      where: {
        id
      },
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
        UsersOnProjects: {
          include: { 
            user: true
          }
        }
      }
    });
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

  async listPendingActivities() {
    const response = await this.prisma.timeLog.findMany({
      where: {
        approvedById: null,
        deniedById: null,
      },
      include: {
        project: true, 
        requestedBy: true
      }
    })

    return response
  }

  async reviewActivity(id: string, reviewActivityDto: { status: "APPROVED" | "REJECTED" }, user: any) {
    try {
      await this.prisma.timeLog.update({
        where: {
          id
        },
        data: {
          ...(
            reviewActivityDto.status === "APPROVED" ? {
              approvedById: user.id
            } : {
              deniedById: user.id
            } 
          )
        }
      })

      return { message: "ok" }
    } catch (error) {
      console.error("error while reviewing activity", error)
      throw { statusCode: 500, message: 'Internal Server Error' }
    }
  } 
}
