import { Request, Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TimeLogService } from './time-log.service';
import { CreateTimeLogDto } from './dto/create-time-log.dto';
import { UpdateTimeLogDto } from './dto/update-time-log.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/res/roles.enum';

@Controller('time-log')
export class TimeLogController {
  constructor(private readonly timeLogService: TimeLogService) {}

  @Post()
  @Roles(Role.STUDENT)
  create(@Request() req, @Body() createTimeLogDto: CreateTimeLogDto) {
    return this.timeLogService.create(createTimeLogDto, req.user);
  }

  @Get()
  @Roles(Role.OWNER, Role.PROFESSOR, Role.STUDENT)
  findAll() {
    return this.timeLogService.findAll();
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.PROFESSOR, Role.STUDENT)
  findOne(@Param('id') id: string) {
    return this.timeLogService.findOne(id);
  }

  @Patch('/approve/:id')
  @Roles(Role.OWNER, Role.PROFESSOR)
  approve(@Param('id') id: string, @Body() updateTimeLogDto: UpdateTimeLogDto) {
    return this.timeLogService.approve(id, updateTimeLogDto);
  }
  @Patch('/deny/:id')
  @Roles(Role.OWNER, Role.PROFESSOR)
  deny(@Param('id') id: string, @Body() updateTimeLogDto: UpdateTimeLogDto) {
    return this.timeLogService.deny(id, updateTimeLogDto);
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
