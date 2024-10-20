import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TimeLogService } from './time-log.service';
import { CreateTimeLogDto } from './dto/create-time-log.dto';
import { UpdateTimeLogDto } from './dto/update-time-log.dto';

@Controller('time-log')
export class TimeLogController {
  constructor(private readonly timeLogService: TimeLogService) {}

  @Post()
  create(@Body() createTimeLogDto: CreateTimeLogDto) {
    return this.timeLogService.create(createTimeLogDto);
  }

  @Get()
  findAll() {
    return this.timeLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeLogService.findOne(id);
  }

  @Patch('/approve/:id')
  approve(@Param('id') id: string, @Body() updateTimeLogDto: UpdateTimeLogDto) {
    return this.timeLogService.approve(id, updateTimeLogDto);
  }
  @Patch('/deny/:id')
  deny(@Param('id') id: string, @Body() updateTimeLogDto: UpdateTimeLogDto) {
    return this.timeLogService.deny(id, updateTimeLogDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTimeLogDto: UpdateTimeLogDto) {
    return this.timeLogService.update(id, updateTimeLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeLogService.remove(id);
  }
}
