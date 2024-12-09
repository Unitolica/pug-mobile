import { Request, Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/res/roles.enum';

type ActivityData = {
  timestamp: number;
  location: {
    longitude: number;
    latitude: number;
  }
}

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(Role.OWNER)
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Post('/:id/request-link')
  @Roles(Role.STUDENT)
  requestLink(@Param('id') id: string, @Request() req: any) {
    return this.projectService.requestLink(id, req.user);
  }

  @Get('/:id/request-link')
  @Roles(Role.STUDENT)
  getRequestLinkStatus(@Param('id') projectId: string, @Request() req: any) {
    return this.projectService.getRequestLinkStatus(projectId, req.user);
  }

  @Post('/respond-link-request')
  @Roles(Role.PROFESSOR, Role.ADMIN)
  respondLinkRequest(@Body() respondLinkRequestDto: { userId: string, projectId: string, response: "ACCEPTED" | "REJECTED" }, @Request() req: any) {
    return this.projectService.respondLinkRequest(respondLinkRequestDto);
  };

  @Get('/link-requests')
  @Roles(Role.PROFESSOR, Role.ADMIN)
  findLinkRequests() {
    return this.projectService.findLinkRequests();
  }

  @Post('/activity')
  @Roles(Role.STUDENT)
  registerActivity(@Body() registerActivityDto: { init: ActivityData, end: ActivityData, projectId: string, description: string }, @Request() req) {
    return this.projectService.registerActivity(registerActivityDto, req.user);
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
  @Roles(Role.OWNER, Role.PROFESSOR, Role.STUDENT)
findAll(@Query('course') course: string, @Query('q') q: string, @Request() req: any) {
    return this.projectService.findAll({ user: req.user, course, q });
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
