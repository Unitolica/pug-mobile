import { Injectable } from '@nestjs/common';
import { CreateTimeLogDto } from './dto/create-time-log.dto';
import { UpdateTimeLogDto } from './dto/update-time-log.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeolocService } from 'src/geoloc/geoloc.service';

@Injectable()
export class TimeLogService {
  constructor(private prisma: PrismaService, private geoloc: GeolocService) {}

  async create(createTimeLogDto: CreateTimeLogDto) {
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

  async findOne(id: string) {
    const response = await this.prisma.timeLog.findUnique({
      where: {
        id: id
      }
    });
    return response;
  }

  async update(id: string, updateTimeLogDto: UpdateTimeLogDto) {
    const response = await this.prisma.timeLog.update({
      where: {
        id: id
      },
      data: updateTimeLogDto
    });
    return { response, message: "Updated" };
  }

  async remove(id: string) {
    const response = await this.prisma.timeLog.delete({
      where: {
        id: id
      }
    });
    return { message: "Deleted" };
  }

  async approve(id: string, updateTimeLogDto: UpdateTimeLogDto) {
    if (!updateTimeLogDto.approvedById) {
      throw { statusCode: 400, message: 'ApprovedById is required!' }
    }
    try{
    const response = await this.prisma.timeLog.update({
      where: {
        id: id
      },
      data: {
        approvedById: updateTimeLogDto.approvedById
      }
    });
    return { response, message: "Approved" };
  } catch (error) {
    return {error, message: "Não foi possível aprovar o registro de tempo!"};
  }
  }
  async deny(id: string, updateTimeLogDto: UpdateTimeLogDto) {
    if (!updateTimeLogDto.deniedById) {
      throw { statusCode: 400, message: 'DeniedById is required!' }
    }
    try{
    const response = await this.prisma.timeLog.update({
      where: {
        id: id
      },
      data: {
        deniedById: updateTimeLogDto.deniedById
      }
    });
    return { response, message: "Denied" };
  } catch (error) {
    return {error, message: "Não foi possível aprovar o registro de tempo!"};
  }
  }
}
