import { Request, Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
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

  @Get('assigned')
  @Roles(Role.OWNER, Role.PROFESSOR, Role.STUDENT)
  findAsigned(@Request() req) {
    return this.projectService.findAssigned(req.user);
  }

  @Get('all')
  @Roles(Role.OWNER, Role.PROFESSOR, Role.STUDENT)
  findMine(@Request() req) {
    // return this.projectService.findMine(req.user);
    return []
  }

  @Get()
  findAll(@Query('course') course: string) {
    return this.projectService.findAll(course);
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.PROFESSOR, Role.STUDENT)
  findOne(@Request() req, @Param('id') id: string) {
    return this.projectService.findOne(id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Patch('update/:id')
  @Roles(Role.OWNER, Role.PROFESSOR, Role.STUDENT)
  updateMine(@Request() req, @Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.updateMine(id, updateProjectDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.OWNER)
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
