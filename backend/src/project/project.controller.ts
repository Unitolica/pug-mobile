import { Request, Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/res/roles.enum';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(Role.OWNER)
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @Roles(Role.OWNER, Role.PROFESSOR, Role.STUDENT)
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.PROFESSOR, Role.STUDENT)
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.PROFESSOR, Role.STUDENT)
  update(@Request() req, @Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.OWNER)
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
