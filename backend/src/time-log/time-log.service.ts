import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateTimeLogDto } from './dto/create-time-log.dto';
import { UpdateTimeLogDto } from './dto/update-time-log.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeolocService } from 'src/geoloc/geoloc.service';
import errors from '../../res/consts';
import { Role } from 'src/auth/res/roles.enum';

@Injectable()
export class TimeLogService {
  constructor(private prisma: PrismaService, private geoloc: GeolocService) {}

  async create(createTimeLogDto: CreateTimeLogDto, user: any) {
    if (user.role == Role.STUDENT && user.id != createTimeLogDto.requestedById) {
      throw new UnauthorizedException();
    }
    if (user.role == Role.STUDENT && !user.projects.some((project) => project.id == createTimeLogDto.projectId)) {
      throw new UnauthorizedException();
    }

    createTimeLogDto.deniedById = null;
    createTimeLogDto.approvedById = null;

    const [lat, lon] = createTimeLogDto.geolocalization.split(',');


    createTimeLogDto.geolocalization = await this.geoloc.getAddressDescByGeoloc(lat, lon);
    try{
      const verify = await this.prisma.usersOnProjects.findFirst({
        where: {
          userId: createTimeLogDto.requestedById,
          projectId: createTimeLogDto.projectId,
        },
      });
      if (!verify) {
        throw { statusCode: 400, message: 'Usuário não está no projeto!' }
      }

      const response = await this.prisma.timeLog.create({
        data: createTimeLogDto
      });
      return { response, message: "Created" };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    const response = await this.prisma.timeLog.findMany();
    return response;
  }

  async findAllFromProject(user: any) {
    const response = await this.prisma.timeLog.findMany(
      {
        where: {
          projectId: {
            in: user.projects.map((project) => project.id)
          }
        }
      }
    );
    return response;
  }

  async findOne(id: string, user: any) {
    const response = await this.prisma.timeLog.findUnique({
      where: {
        id: id
      }
    });

    if (user.role != Role.ADMIN && !user.projects.some((project) => project.id == response.projectId)) {
      throw new UnauthorizedException();
    }

    return response;
  }



  async update(id: string, updateTimeLogDto: UpdateTimeLogDto, user: any) {
    if (user.role == Role.STUDENT && user.id != id) {
      throw new UnauthorizedException();
    }

    const timeLog = await this.prisma.timeLog.findUnique({
      where: {
        id: id
      }
    });

    if (timeLog.deniedById || timeLog.approvedById) {
      throw { statusCode: 400, internalCode: 4, message: errors[2] }
    }

    const response = await this.prisma.timeLog.update({
      where: {
        id: id
      },
      data: updateTimeLogDto
    });
    return { response, message: "Updated" };
  }

  async remove(id: string, user: any) {
    if (user.role == Role.STUDENT && user.id != id) {
      throw new UnauthorizedException();
    }

    const response = await this.prisma.timeLog.delete({
      where: {
        id: id
      }
    });
    return { message: "Deleted" };
  }
}
