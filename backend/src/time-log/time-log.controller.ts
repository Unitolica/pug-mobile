import { Request, Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { TimeLogService } from './time-log.service';
import { CreateTimeLogDto } from './dto/create-time-log.dto';
import { UpdateTimeLogDto } from './dto/update-time-log.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/res/roles.enum';

@Controller('time-log')
export class TimeLogController {
  constructor(private readonly timeLogService: TimeLogService) {}

  @Patch('/approve/:id')
  @Roles(Role.OWNER, Role.PROFESSOR)
  approve(@Request() req, @Param('id') id: string) {
    const updateTimeLogDto = new UpdateTimeLogDto();
    updateTimeLogDto.approvedById = id;

    return this.timeLogService.update(id, updateTimeLogDto, req.user);
  }
  @Patch('/deny/:id')
  @Roles(Role.OWNER, Role.PROFESSOR)
  deny(@Request() req, @Param('id') id: string) {
    const updateTimeLogDto = new UpdateTimeLogDto();
    updateTimeLogDto.deniedById = id;

    return this.timeLogService.update(id, updateTimeLogDto, req.user);
  }

  @Post()
  @Roles(Role.STUDENT)
  create(@Request() req, @Body() createTimeLogDto: CreateTimeLogDto) {
    return this.timeLogService.create(createTimeLogDto, req.user);
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.PROFESSOR, Role.STUDENT)
  findAllFromProject(@Request() req) {
    return this.timeLogService.findAllFromProject(req.user);
  }

  @Get()
  findAll() {
    return this.timeLogService.findAll();
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.PROFESSOR, Role.STUDENT)
  findOne(@Request() req, @Param('id') id: string) {
    return this.timeLogService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(Role.STUDENT)
  update(@Request() req, @Param('id') id: string, @Body() updateTimeLogDto: UpdateTimeLogDto) {
    return this.timeLogService.update(id, updateTimeLogDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.STUDENT)
  remove(@Request() req, @Param('id') id: string) {
    return this.timeLogService.remove(id, req.user);
  }
}
