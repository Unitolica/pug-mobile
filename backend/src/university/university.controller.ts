import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UniversityService } from './university.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/res/roles.enum';

@Controller('university')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Post()
  create(@Body() createUniversityDto: CreateUniversityDto) {
    return this.universityService.create(createUniversityDto);
  }

  @Get()
  @Roles(Role.OWNER, Role.PROFESSOR, Role.STUDENT)
  findAll() {
    return this.universityService.findAll();
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.PROFESSOR, Role.STUDENT)
  findOne(@Param('id') id: string) {
    return this.universityService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUniversityDto: UpdateUniversityDto) {
    return this.universityService.update(id, updateUniversityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.universityService.remove(id);
  }
}
